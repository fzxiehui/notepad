# u-boot

:::tip 提示
本示例使用`docker` + `docker-compose` 构建
:::
## 使用`docker`搭建编译环境

```shell
# 创建目录
mkdir -p build_os/build-env && cd build_os/build-env
目录如下:
├── docker-compose.yaml
├── Dockerfile
└── README.md
```

### 文件

- `docker-compose.yaml`

```yaml
version: "3"

services:
  build:
    image: opi-build:20.04
    container_name: opi_build_env
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ../work:/work
    working_dir: /work
    tty: true
    stdin_open: true
```

- `Dockerfile`

```dockerfile
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai

# 基础工具 + 交叉编译环境
RUN apt update && apt install -y \
		build-essential \
		gcc-aarch64-linux-gnu \
		g++-aarch64-linux-gnu \
		make \
		bc \
		bison \
		flex \
		libssl-dev \
		libncurses-dev \
		device-tree-compiler \
		git \
		wget \
		curl \
		vim \
		ca-certificates \
		sudo \
		rsync \
		file \
		qemu-user-static \
		debootstrap \
		kmod \
		cpio \
		python3 \
		python3-distutils \
		swig \
		python3-dev \
		&& rm -rf /var/lib/apt/lists/*

# 默认工作目录
WORKDIR /work

# 给 root 用（嵌入式编译不需要 sudo 限制）
CMD ["/bin/bash"]
```

- 构建`docker`镜像

:::warning 提示
- 更新`Dockerfile`时需要重新执行`docker-compose build`
- 如果`docker images`有`<none>`镜像, 可以通过`docker rmi <IMAGE ID>`删除
:::

- 构建指令

```shell
docker-compose build
```

## 使用编译环境(进入容器)

:::warning 提示
- `--rm` 参数可以在`退出`容器时自动清理容器, 可以减少清理操作, 适合与编译环境
:::

```shell
# 在 build_os/build-env 目录中
mkdir ../work && cd ../work

# clone u-boot 
# 未来可以换成 厂家的u-boot
git clone https://github.com/u-boot/u-boot.git
cd u-boot
git checkout v2022.07   # 稳定版本

# 返回build_os/build-env目录
cd ../../build-env

# 进入容器
docker-compose run --rm build

# 最终目录
.
├── build-env
│   ├── docker-compose.yaml
│   ├── Dockerfile
│   └── README.md
└── work
    └── u-boot
```

## 编译`u-boot`

:::warning 提示
- 以下内容都在容器中执行
:::

```shell
# 进入 u-boot 目录
cd u-boot
# 查看当前 u-boot 支持哪些芯片
ls configs

# 编译 以 rk3328 为例
export ARCH=arm64
export CROSS_COMPILE=aarch64-linux-gnu-
make evb-rk3328_defconfig
make -j$(nproc)

# 如果没有报错, 并生成`u-boot-rockchip.bin`说明成功
ls u-boot-rockchip.bin

# 清理项目(删除编译内容)
make clean
```


## 厂家u-boot(todo)

```shell
git clone https://github.com/orangepi-xunlong/u-boot-orangepi.git
cd u-boot-orangepi
ls configs | grep rk3328
# > orangepi-r1-plus-rk3328_defconfig

make orangepi-r1-plus-rk3328_defconfig
```


## 刷入u-boot
