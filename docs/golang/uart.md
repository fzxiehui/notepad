# 串口通信

## 依赖

```shell
go get go.bug.st/serial
```

## 接口

1. 公共接口

	- `GetPortsList() []string`获取当前主机上可用的串口列表

		- 返回: 串口名称列表

		```go
		fmt.Println(GetPortsList())
		// [/dev/ttyS0 /dev/ttyUSB0 /dev/ttyUSB1]
		```
	- `IsPort(portName string, ports []string) bool`判断串口名是否在串口列表中

		- portName: 要查询的串口名称
		- ports: 串口名称列表，可通过`GetPortsList`获取

		```go
		fmt.Println(GetPortsList())
		// [/dev/ttyS0 /dev/ttyUSB0 /dev/ttyUSB1]
		ports := GetPortsList()
		fmt.Println(IsPort("/dev/ttyUSB1", ports))
		// true
		```

1. `Uart`类接口

	- `NewUart(portName string, options ...Option) Uart` 

		- portName: 串口名
		- options: 选项 

			- `WithBaudRate(baudRate int) Option` 设置波特率, 默认`9600`
			- `WithErrorHandler(handler func(error)) Option`设置错误处理程序
	
	- `GetName() string`获取串口名

	- `Open() error`打开串口
	
	- `Send(buf []byte) (int, error)`发送完成后返回，会阻塞

		- buf: 要发送的数据

	- `Read() []byte`读取, 会阻塞


	- `ReadWithTimeout(timeout time.Duration) ([]byte, error)`读取，会阻塞，可以设设置超时时间

		- timeout: 最长等待时间 e.g: `3 * time.Second`

	
	- `SendWithBuffer(buf []byte)`带缓冲区的发送，不会阻塞立即返回

		- buf: 要发送的数据

	- `Close()`关闭串口

## 示例

> 以下示例，短接串口读写

```go
// 列出串口列表
fmt.Println(GetPortsList())
// [/dev/ttyS0 /dev/ttyUSB0 /dev/ttyUSB1]

// 获取串中列表
ports := GetPortsList()
fmt.Println(IsPort("/dev/ttyUSB1", ports))
// true

// 创建串口
uart := NewUart("/dev/ttyUSB0", WithBaudRate(9600))

// 打开串口
uart.Open()

// 记得关闭
defer uart.Close()

// 收发字符串
go func(u Uart) {
	time.Sleep(3 * time.Second)
	u.Send([]byte("Hello"))
}(uart)

fmt.Println(uart.Read())
//output: [72 101 108 108 111]

// 收发结构体
type User struct {
	Name string
}
go func(u Uart) {
	time.Sleep(1 * time.Second)
	user := User{
		Name: "Hello",
	}
	b, _ := json.Marshal(user)
	fmt.Println(string(b))
	//output: {"Name":"Hello"}
	u.Send(b)
}(uart)

buf := uart.Read()
readUser := User{}
json.Unmarshal(buf, &readUser)
fmt.Println(readUser)
//output: {Hello}
```
