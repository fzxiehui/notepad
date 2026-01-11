# 代理

> - @TODO: docker 部署
> - @TODO: socketio, web socket
> - @TODO: 前端路由方式影响

## Nginx

> 只适用于 http

- 安装(可以用`docker`)

```shell
sudo apt install nginx
```

::: details 案例**docker-compose&https&socket.io**

- `ssl`自签

```shell
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout /web/nginx.key \
  -out /web/nginx.crt \
  -subj "/C=CN/ST=Test/L=Test/O=Test/OU=Dev/CN=localhost"
```

- `docker-compose`

```yaml
version: '2'

services:
  nginx:
    image: nginx:1.26-alpine
    container_name: mynginx
    networks:
      hpweb:
        ipv4_address: 172.16.8.252
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /web/html:/usr/share/nginx/html
      - /web/ng.conf:/etc/nginx/conf.d/default.conf
      - /web/nginx.crt:/etc/nginx/nginx.crt
      - /web/nginx.key:/etc/nginx/nginx.key
      - /web/logs/nginxlogs:/var/log/nginx
    restart: always

networks:
  hpweb:
    driver: bridge
    ipam:
      config:
        - subnet: 172.16.8.0/24
          gateway: 172.16.8.254

```

- `nginx`配置

```ini
# -----------------------------
# HTTP 自动跳转 HTTPS
# -----------------------------
server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    return 301 https://$host$request_uri;
}

# -----------------------------
# HTTPS 主服务
# -----------------------------
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name localhost;

    # 自签名证书
    # ssl_certificate /etc/nginx/ssl/nginx.crt;
    # ssl_certificate_key /etc/nginx/ssl/nginx.key;
    ssl_certificate /etc/nginx/nginx.crt;
    ssl_certificate_key /etc/nginx/nginx.key;

    # TLS 强化（可选）
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # -----------------------------
    # 保留原始客户端 IP
    # -----------------------------
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;

    # -----------------------------
    # 后端 API（含 Socket.IO）
    # -----------------------------
    location /api/ {
        proxy_pass http://172.16.8.254:5551/;

        # --- WebSocket 支持 ---
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # --- IP 传递 ---
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }

    # -----------------------------
    # 前端静态页面
    # -----------------------------
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
:::


## HAProxy

- 安装

```shell
sudo apt install haproxy
```

::: details 案例 示例(远程连接)

- 示例(远程连接), 在`/etc/haproxy/haproxy.cfg`末尾追加.

```ini
frontend tcp_proxy
	bind *:3389
	mode	tcp
	default_backend rdp_servers

backend rdp_servers
	mode	tcp
	server rdp1 172.16.1.89:3389 check
```

- 推荐做法

> haproxy 配置文件不支持分文件编写, 所有可以使用以下方法进行分文件配置

```shell
# 创建配置目录
sudo mkdir -p /etc/haproxy/config

# ! 第一次把默认的配置文件放到config项目中
sudo cat /etc/haproxy/haproxy.cfg > /etc/haproxy/config/00-defaults.cfg

# 可以添加新配置 xx.cfg 到 /etc/haproxy/config/
# ... 

# 应用新配置
sudo cat /etc/haproxy/config/*.cfg > /etc/haproxy/haproxy.cfg
sudo systemctl restart haproxy.service
# 或 systemctl reload haproxy # 安全平滑更新
```
:::
