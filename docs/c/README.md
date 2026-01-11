# C语言

## 开发环境搭建

### 安装工具

| 工具 | 用途 |
| :---- | :---- |
| gcc | c 编译器 |
| g++ | c++ 编译器 |
| make, cmake | 构建工具 |
| gdb | 调试 |
| pkg-config | 查库路径 |


```shell
sudo apt update
# 同平台编译
sudo apt install -y build-essential gdb make cmake pkg-config

# 交叉编译
sudo apt install -y gcc-arm-linux-gnueabihf libc6-armhf-cross

# windows 编译工具
sudo apt install -y mingw-w64
```

### `coc`编辑器插件

- 安装`clangd`

```shell
sudo apt install -y clangd
# 验证
clangd --version
```

- 安装`coc-clangd`

- 进入`nvim`

```shell
:CocInstall coc-clangd
```


## HelloWorld

- `CMakeLists.txt`

```cmake
cmake_minimum_required(VERSION 3.10)
project(demo C)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_executable(demo main.c)
```

- `main.c`

```c
#include <stdio.h>


int main(void) {
	printf("Hello World!\n");
	return 0;
}
```

- 编译

```shell
mkdir build && cd build
cmake ..
make
```
