# Go 安装

:::tip 系统环境
``ubuntu 1804``
:::

:::tip 参考信息
参考地址: ``https://www.digitalocean.com/community/tutorials/how-to-install-go-1-6-on-ubuntu-16-04``
下载地址: ``https://go.dev/dl/``
:::

## 下载

```shell
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
```

## 安装

```shell
tar xvf go1.21.5.linux-amd64.tar.gz
sudo chown -R root:root ./go
sudo mv go /usr/local/
```

## 设置环境

```shell
sudo vi ~/.profile

# 文件末尾添加
export GOPATH=$HOME/work
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin

# 使环境生效
source ~/.profile
```

## 测试安装

1. 创建项目
	
	```shell
	mkdir godemo
	cd godemo
	go mod init godemo
	```

1. 编写代码`vi hello.go`,并粘贴以下代码.

	```go
	package main

	import "fmt"

	func main() {
		fmt.Printf("hello, world\n")
	}
	```

1. 运行

	```shell
	go run hello.go
	# OUTPUT: hello, world
	```

1. 安装卸载

	```shell
	# 安装
	go install hello.go
	# 测试运行
	hello
	# OUTPUT: hello, world
	# 查看文件所以在位置
	which hello
	# OUTPUT: /home/hello/go/bin/hello
	# 安装路径就是PATH中设置的GOPATH/bin
	# 可以使用 rm 直接删除进行卸载
	```
