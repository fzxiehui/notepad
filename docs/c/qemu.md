# qemu

## 说明

| 软件 | 模拟对象 | 用途 |
| :--- | :------- | :--- |
| qemu-user | 单个用户态程序 | 交叉程序运行 |
| qemu-user-static | 单个用户态程序 | Docker 多架构 |
| qemu-system | 整台计算机 / SoC | 嵌入式/OS |


## 安装

```shell
sudo apt install -y qemu-user qemu-system qemu-user-static
```

## 运行

- `armv7 32`

```shell
qemu-arm -L /usr/arm-linux-gnueabihf ./demo
```

- `armv8 64`

```shell
qemu-aarch64 -L /usr/aarch64-linux-gnu ./demo
```
