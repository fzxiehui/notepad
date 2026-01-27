# 项目搭建

## 基础信息搭建

- mod

```shell
# mod 初始化 PROJECT_NAME 改为项目名, 会生成 -> go.mod
go mod init PROJECT_NAME
# 检查依赖(没用到会自动清理, 没有会自己下载) 
go mod tidy
```

- `nvim main.go`

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello World !")
}
```


- `nvim Makefile`

> 其中`PROJECT_NAME`改为项目名

```Makefile
.PHONY: help test build run 

default: help

APP_NAME = PROJECT_NAME

help:
	@echo "Usage:"
	@echo "    make run"
	@echo "    make build"
	@echo "    make test"

build:
	go build -o bin/$(APP_NAME)

run:
	go run main.go

test:
	go test -v -count=1 ./...
```
