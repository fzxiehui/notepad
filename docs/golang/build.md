# 编译相关

## `Linux`编译`windows`应用

```shell
GOOS=windows GOARCH=amd64 go build -o xxx.exe xxx.go
```

## `Linux`编译`windows`应用,包含`CGO`

依赖: `sudo apt install gcc-mingw-w64`

```shell
CGO_ENABLED=1 CC=x86_64-w64-mingw32-gcc GOOS=windows GOARCH=amd64 go build -o xxx.exe xxx.go
```

## `Linux x86_64`编译`linux arm64`应用

```shell
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o app main.go
```

## `Linux x86_64`编译`linux arm64`应用,包含`CGO`

```shell
CGO_ENABLED=1 GOOS=linux GOARCH=arm64 CC=aarch64-linux-gnu-gcc go build -o app main.go
```
