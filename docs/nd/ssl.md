# ssl证书

问题: 经过调试 post 接口不带参数时可以正常访问, 但是带上json 参数时 会在 request.json.get("xx") 时卡住
原因: socketio 与 http 不能混用

## python启动函数

::: danger
以后不能这样用了
:::

```python
def start_app():
    logger.info('Starting hpweb program~~')
    # app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(app.config['PORT']),
        debug=app.config['DEBUG'],
        use_reloader=False,   # 可选：避免多进程冲突
    )
```

## 生成证书

```shell
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout /web/nginx.key \
  -out /web/nginx.crt \
  -subj "/C=CN/ST=Test/L=Test/O=Test/OU=Dev/CN=localhost"
```

## docker-compose

```yaml
version: '2'

services:
  tdengine:
    image: tdengine/tdengine:3.3.6.9
    container_name: tdengine
    restart: always
    networks:
      hpweb:
        ipv4_address: 172.16.8.253
    ports:
      - "6030:6030"
      - "6041:6041"
    volumes:
      - /media/ssd/data:/var/lib/taos
    environment:
      - TZ=Asia/Shanghai
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


## nginx 

- 方案一(最终方案)

```json
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

方案二: 有点问题

```json
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


