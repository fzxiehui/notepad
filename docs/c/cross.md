# 交叉编译

## 编译工具

| 工具 | 用途 |
| :---- | :---- |
| `arm-linux-gnueabihf-gcc` | ARMv7(32位) |
| `aarch64-linux-gnu-gcc` | ARMv8(64位) |
| `x86_64-w64-mingw32-gcc` | Windows(64位) |
| `i686-w64-mingw32-gcc` | Windows(32位) |

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

## 指令编译器构建

- 构建`armv7 32`

```shell
mkdir build && cd build
cmake .. \
  -DCMAKE_C_COMPILER=arm-linux-gnueabihf-gcc

# 编译
make 

# 检查
file ./demo 

output:
./demo: ELF 32-bit LSB pie executable, ARM, EABI5 version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-armhf.so.3, BuildID[sha1]=1912ec2ef0b2da407b3f13fb1581ebd061f91ecd, for GNU/Linux 3.2.0, not stripped
```

- 构建`armv8 64`

```shell
mkdir build && cd build
cmake .. \
  -DCMAKE_C_COMPILER=aarch64-linux-gnu-gcc

# 编译
make 

# 检查
file ./demo 

output:
./demo: ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=9b618b745295d77ddcec312a8b03200c01fb1dc8, for GNU/Linux 3.7.0, not stripped
```

- 构建`windows 64`

```shell
mkdir build && cd build
cmake .. \
    -DCMAKE_C_COMPILER=x86_64-w64-mingw32-gcc
make
```

## 使用`Toolchain File`构建

:::danger
- 没搞定!!!
:::

- toolchain-arm.cmake

```cmake
# 目标系统
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm)

# 交叉编译器
set(CMAKE_C_COMPILER arm-linux-gnueabihf-gcc)

# sysroot（非常重要）
set(CMAKE_SYSROOT /usr/arm-linux-gnueabihf)

# 查找规则
set(CMAKE_FIND_ROOT_PATH /usr/arm-linux-gnueabihf)

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
```

- 构建

```shell
mkdir -p build && cd build

cmake .. \
  -DCMAKE_TOOLCHAIN_FILE=../toolchain-arm.cmake

make
```
