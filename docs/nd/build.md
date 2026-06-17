# 编译环境搭建

## ssh 

```shell
sudo ifconfig eno2 192.168.2.9
sudo ip route add 192.168.2.0/24 dev eno2
ssh root@192.168.2.89
```

## 移除环境 

```shell
# web
systemctl stop hpweb hpweb_socket hpweb_ota hpweb_broadcast
# systemctl start hpweb_socket hpweb_ota hpweb_broadcast
# systemctl start hpweb hpweb_socket hpweb_ota hpweb_broadcast
systemctl disable hpweb hpweb_socket hpweb_ota hpweb_broadcast
# systemctl enable hpweb hpweb_socket hpweb_ota hpweb_broadcast

# can-router dbwriter ota
systemctl stop can-router dbwriter ota
# systemctl start can-router dbwriter ota
systemctl disable can-router dbwriter ota
# systemctl enable can-router dbwriter ota

# docker-compose
cd /data/config/ && docker-compose down
```

## docker 代理

- bash

```shell
export https_proxy=http://192.168.2.9:7890 http_proxy=http://192.168.2.9:7890 all_proxy=socks5://192.168.2.9:7890
```

- config

```shell

sudo mkdir -p /etc/systemd/system/docker.service.d
cat > /etc/systemd/system/docker.service.d/proxy.conf

[Service]
Environment="HTTP_PROXY=http://192.168.2.9:7890/"
Environment="HTTPS_PROXY=http://192.168.2.9:7890/"
Environment="NO_PROXY=localhost,127.0.0.1,.example.com"
```

- 重启服务

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 手动验证过程

- 启动

```shell
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

# 运行ubuntu2404
docker run --rm --platform linux/arm64 -it ubuntu:24.04
```

- `python`与`venv`验证

```shell
apt update
apt install -y python3 python3-pip
apt install python3-venv
python3 -m venv /opt/venv

# docker env :
# 将 venv 的 bin 目录加到 PATH 的最前面
# ENV PATH="/opt/venv/bin:$PATH"
export PATH="/opt/venv/bin:$PATH"
```

- 过程中时区选择问题

> 在验证安装python过程中发现时区选择问题，解决方法为：
> 如果在容器内部，使用 `export TZ=Asia/Shanghai` 避免 tzdata 弹出交互式选择
> Dockerfile 使用以下配置

```Dockerfile
# 定义环境变量

## 设置时区，避免 tzdata 弹出交互式选择
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai
```

- 前端验证

- 环境

```shell
export http_proxy=http://192.168.2.9:7890 && export https_proxy=http://192.168.2.9:7890 &&  export ALL_PROXY=socks5://192.168.2.9:7890 && export HTTP_PROXY=http://192.168.2.9:7890 && export HTTPS_PROXY=http://192.168.2.9:7890 

# 清除之前设置的 npm 代理（以防干扰国内镜像）
npm config delete proxy
npm config delete https-proxy

# 强制将源切换为国内阿里云镜像
npm config set registry https://registry.npmmirror.com
npm install -g yarn

# 确保 yarn 使用国内镜像源
rm -rf yarn.lock
yarn config set registry https://registry.npmmirror.com
yarn install
```

- 前端编译测试

```shell
tar -vzxf build.tar.gz
ln -s /node_modules /work/frontend/node_modules
cd /work/frontend && npm run build
```

## 迭代过程

### v0.0.1

```shell
FROM --platform=linux/arm64 ubuntu:24.04

# 定义环境变量

## 设置时区，避免 tzdata 弹出交互式选择
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai

## python环境变量
ENV PATH="/opt/venv/bin:$PATH"

# 安装python3
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

# 创建虚拟环境
RUN python3 -m venv /opt/venv

# pip 依赖
RUN cat > /opt/requirements.txt <<EOF
pyinstaller
Flask
Flask-Cors
Flask-JWT-Extended
Flask-Caching
pyzmq
grpcio
protobuf
psutil
numpy
openpyxl
pandas
taos-ws-py
taospy
cryptography
cachetools
scapy
Flask-SocketIO
redis
EOF

# 安装PIP依赖
RUN /opt/venv/bin/pip install -r /opt/requirements.txt
```

### v0.0.2

> 0.0.1 中的python依赖没安装上

```shell
FROM --platform=linux/arm64 hpweb:0.0.1

# 定义环境变量

## 设置时区，避免 tzdata 弹出交互式选择
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai

## python环境变量
ENV PATH="/opt/venv/bin:$PATH"

# pip 依赖
RUN echo pyinstaller >> /opt/requirements.txt
RUN echo Flask >> /opt/requirements.txt
RUN echo Flask-Cors >> /opt/requirements.txt
RUN echo Flask-JWT-Extended >> /opt/requirements.txt
RUN echo Flask-Caching >> /opt/requirements.txt
RUN echo pyzmq >> /opt/requirements.txt
RUN echo grpcio >> /opt/requirements.txt
RUN echo protobuf >> /opt/requirements.txt
RUN echo psutil >> /opt/requirements.txt
RUN echo numpy >> /opt/requirements.txt
RUN echo openpyxl >> /opt/requirements.txt
RUN echo pandas >> /opt/requirements.txt
RUN echo taos-ws-py >> /opt/requirements.txt
RUN echo taospy >> /opt/requirements.txt
RUN echo cryptography >> /opt/requirements.txt
RUN echo cachetools >> /opt/requirements.txt
RUN echo scapy >> /opt/requirements.txt
RUN echo Flask-SocketIO >> /opt/requirements.txt
RUN echo redis >> /opt/requirements.txt

# 安装PIP依赖
RUN /opt/venv/bin/pip install -r /opt/requirements.txt
```


### v0.0.3

> - 在v0.0.2的基础上，增加 nodejs v21
> - 在v0.0.2的基础上，增加 flask-migrate
> - 在v0.0.2的基础上，增加 flask_sqlalchemy

```Dockerfile
FROM --platform=linux/arm64 hpweb:0.0.2

# 定义环境变量

## 设置时区，避免 tzdata 弹出交互式选择
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai

# pip 依赖
RUN echo flask-migrate >> /opt/requirements.txt
RUN echo flask_sqlalchemy >> /opt/requirements.txt

# 安装PIP依赖
RUN /opt/venv/bin/pip install -r /opt/requirements.txt

# 安装必备的依赖（curl, gnupg, ca-certificates）
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 下载并导入 NodeSource 签名密钥，配置 Node.js v21 存储库
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_21.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

# 更新源并安装 Node.js
RUN apt-get update && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 验证安装
RUN node -v && npm -v
```

## v0.0.4

- 在`v0.0.3`的基础上，增加前端依赖
- 在`v0.0.3`的基础上，增加入口文件`/app/serve.py`
- 在`v0.0.3`的基础上，`watchdog`与`inotify-simple`，用于文件变化检测
- 在`v0.0.3`的基础上，`flask-socketio`与`eventlet`
- 在`v0.0.3`的基础上，增加启动命令


```Dockerfile
FROM --platform=linux/arm64 hpweb:0.0.3

# 定义环境变量

## 设置时区，避免 tzdata 弹出交互式选择
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai


# 前端
COPY ./node_modules /node_modules

# app
RUN mkdir -p /app
COPY ./serve.py /app/serve.py

# pip 依赖
RUN echo watchdog >> /opt/requirements.txt
RUN echo inotify-simple >> /opt/requirements.txt
RUN echo flask-socketio >> /opt/requirements.txt
RUN echo eventlet >> /opt/requirements.txt

# 安装PIP依赖
RUN /opt/venv/bin/pip install -r /opt/requirements.txt

CMD ["python", "/app/serve.py"]
```


## v0.0.5

- 修复`eventlet`与`flask-socketio`的兼容性问题
- 修复删除`work`目录问题

```Dockerfile
FROM --platform=linux/arm64 hpweb:0.0.4
COPY ./serve.py /app/serve.py
```


## 构建命令

```shell
# docker build -t hpweb:version . 
# e.g:
docker build -t hpweb:0.0.3 .
```


## docker 使用

```shell
docker save hpweb:0.0.2 > build.tar.gz
docker load -i build.tar.gz
docker run --rm --platform linux/arm64 -it hpweb:0.0.2
docker run --rm -it -v ./work:/work/ -v ./node_modules:/node_modules hpweb:0.0.3

docker run --rm -it \
  -v ./work:/work/ \
  -v ./node_modules:/node_modules \
  -p 3158:3158 \
  hpweb:0.0.3 \
  python3 /work/ser.py


v6:
docker run --rm  \
    -v ./work:/work/ \
    -p 3158:3158 \
    hpweb:0.0.6
```

