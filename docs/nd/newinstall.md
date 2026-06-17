# 新安装

## 历史测试功能清除

```shell
# 停止并移除测试服务
systemctl stop otaweb
systemctl disable otaweb
rm /usr/lib/systemd/system/otaweb.service

# 删除测试内容
cd /web && ls -A | grep -v '^lost+found$' | xargs rm -rf
```

## 历史服务

```shell
systemctl stop hpwebt
systemctl stop hpweb_broadcast
systemctl stop hpweb_socket
systemctl stop hpweb
```

## 手动删除

```shell
systemctl stop hpwebt hpweb_broadcast hpweb_socket hpweb
systemctl disable hpwebt hpweb_broadcast hpweb_socket hpweb

rm /usr/lib/systemd/system/hpweb.service 
rm /usr/lib/systemd/system/hpweb_broadcast.service 
rm /usr/lib/systemd/system/hpweb_ota.service 
rm /usr/lib/systemd/system/hpweb_socket.service 
rm /usr/lib/systemd/system/hpwebt.service 
cd /web && ls -A | grep -v '^lost+found$' | xargs rm -rf
```


## 构建脚本

```make
.PHONY: build rely py send package

clean:
	rm -rf output

py:
	@echo "tar usrbin ..."
	tar -zcf output/usrbin.tar.gz usrbin/* -C .
	@echo "install: tar -vxzf usrbin.tar.gz -C /web"

rely:
	@echo "cp rely ..."
	cp rely/* output/

build:
	mkdir -p output
	@echo "tar otaweb ..."
	tar -zcf output/otaweb.tar.gz otaweb/* -C .
	@echo "install: tar -vxzf otaweb.tar.gz -C /web"
	@echo "copy load sh ..."
	cp 01load.sh output/

send:
	@echo "send test ..."
	scp ./output/* root@192.168.2.2:/data/web/

package:
	@echo "package"
	tar -zcvf bin.tar.gz output/* -C .
```


## load 脚本

```shell
#!/bin/sh

set -e

# step 1
TD_IMAGE="tdengine/tdengine"
TD_TAR="/data/web/tdengine_3.3.6.9.tar"

# step 2
NGINX_IMAGE="nginx"
NGINX_TAR="/data/web/nginx-1.26-alpine.tar"

# step 3 redis 
REDIS_IMAGE="redis"
REDIS_TAR="/data/web/redis_7.0.tar"

# step 4 python
USRBIN_PATH="/web/usrbin"

echo "====== step 1: check tdengine image ======"
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${TD_IMAGE}:"; then
    echo "tdengine load ..."
    if [ -f "$TD_TAR" ]; then
        docker load -i "$TD_TAR"
        echo "tdengine load success"
    else
        echo "$TD_TAR does not exist !"
    fi
else
    echo "tdengine image exist"
fi

echo "====== step 2: check nginx image ======"
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${NGINX_IMAGE}:"; then
    echo "nginx load ..."
    if [ -f "$NGINX_TAR" ]; then
        docker load -i "$NGINX_TAR"
        echo "nginx load success"
    else
        echo "$NGINX_TAR does not exist !"
    fi
else
    echo "nginx image exist"
fi

echo "====== step 3: check redis image ======"
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${REDIS_IMAGE}:"; then
    if [ -f "$REDIS_TAR" ]; then
        echo "redis load ..."
        docker load -i "$REDIS_TAR"
        echo "redis load success"
    else
        echo "$REDIS_TAR does not exist !"
    fi
else
    echo "redis image exist"
fi

echo "====== step 4: check usrbin ======"
if [ -d "$USRBIN_PATH" ]; then
    echo "usrbin install success"
else
    echo "unzip usrbin ..."
    tar zxf /data/web/usrbin.tar.gz -C /web
fi

echo "====== end ======"
```

## 手动操作根文件

```shell
tar zxf /data/web/build.tar.gz -C /web
cp /web/app/app/script/deploy/hpweb.service /usr/lib/systemd/system/
systemctl enable hpweb.service
systemctl start hpweb.service
```

## 复制文件

```shell
mkdir -p /data/web/ && cd /data/web/
scp root@192.168.2.89:/build/output/* .
```

## 最后部署的nginx
> 包含正则

```shell

server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    access_log /var/log/nginx/access.log;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name localhost;

    access_log /var/log/nginx/access.log;
    error_log  /var/log/nginx/error.log warn;

    ssl_certificate /etc/nginx/nginx.crt;
    ssl_certificate_key /etc/nginx/nginx.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;

		# AUTH
		location = /_auth_check {
        internal;
        proxy_pass http://127.0.0.1:5551/auth/verify_token; 
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
    }

		# master
    location /master/api/ota/ {
				auth_request /_auth_check;

        proxy_pass http://127.0.0.1:5661/;

        client_max_body_size 0;
        proxy_request_buffering off;
        proxy_buffering off;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_connect_timeout 10s;
        proxy_send_timeout 1200s;
        proxy_read_timeout 1200s;
    }

    location /master/api/ {

        proxy_pass http://127.0.0.1:5551/;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_connect_timeout 10s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_buffering off;
    }

    location /master/socket.io/ {

        proxy_pass http://127.0.0.1:5552/socket.io/;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_connect_timeout 10s;

        proxy_buffering off;

    }

		# slave
		location ~ ^/mbmu([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-4])/api/ota/(.*)$ {
        # 开启认证检查
        auth_request /_auth_check;

        set $mbmu_id $1;
        set $remaining_uri $2;
        proxy_pass http://10.0.0.$mbmu_id:5661/$remaining_uri$is_args$args;

        client_max_body_size 0;
        proxy_request_buffering off;
        proxy_buffering off;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_connect_timeout 10s;
        proxy_send_timeout 1200s;
        proxy_read_timeout 1200s;
    }

		location ~ ^/mbmu([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-4])/api/(.*)$ {
        set $mbmu_id $1;
        set $remaining_uri $2;
        proxy_pass http://10.0.0.$mbmu_id:5551/$remaining_uri$is_args$args;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_connect_timeout 10s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_buffering off;
    }

		location ~ ^/mbmu([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-4])/socket.io/(.*)$ {
        set $mbmu_id $1;
        proxy_pass http://10.0.0.$mbmu_id:5552/socket.io/$2$is_args$args;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_connect_timeout 10s;

        proxy_buffering off;

    }

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```


## 开发过程中使用的nginx配置

```shell
server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name localhost;

    ssl_certificate /etc/nginx/nginx.crt;
    ssl_certificate_key /etc/nginx/nginx.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;

    location /mbmu1/api/ota/ {

        proxy_pass http://172.16.8.254:5661/;
        # proxy_pass http://192.168.2.88:5001/;

	client_max_body_size 0;
	proxy_request_buffering off;
	proxy_buffering off;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_connect_timeout 10s;
        proxy_send_timeout 1200s;
        proxy_read_timeout 1200s;
    }

    location /mbmu1/api/ {

        proxy_pass http://172.16.8.254:5551/;
        # proxy_pass http://192.168.2.88:5001/;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_connect_timeout 10s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_buffering off;
    }



    location /mbmu1/socket.io/ {

        proxy_pass http://172.16.8.254:5552/socket.io/;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_connect_timeout 10s;

        proxy_buffering off;

    }

        location /mbmu2/api/ {

        proxy_pass http://192.168.2.2:5551/;


        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_connect_timeout 10s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_buffering off;
    }


    location /mbmu2/socket.io/ {

        proxy_pass http://192.168.2.2:5552/socket.io/;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_connect_timeout 10s;

        proxy_buffering off;

    }

    location / {
	proxy_pass http://192.168.2.88:6800;

	proxy_http_version 1.1;

	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "upgrade";

	proxy_set_header Host $host;
	proxy_set_header X-Forwarded-For $remote_addr;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```


## docker-compose.yaml

```yaml
version: '2'

services:
  tdengine:
    image: tdengine/tdengine:3.3.6.9
    container_name: tdengine
    restart: always
    network_mode: "host"
    volumes:
      - /data/taosdb:/var/lib/taos
    environment:
      - TZ=Asia/Shanghai
  nginx:
    image: nginx:stable-alpine
    container_name: mynginx
    network_mode: "host"
    volumes:
      - /web/html:/usr/share/nginx/html:ro
      - /data/config/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - /data/config/nginx/ssl/:/etc/nginx/ssl/
      - /data/config/nginx/ssl/:/etc/nginx/ssl/
      - /log/nginx:/var/log/nginx/
    restart: always
```
