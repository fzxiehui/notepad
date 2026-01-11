# 上下文

## 可取消上下文

> 统一退出

```go
package main

import (
	"context"
	"fmt"
	"time"
)

func main() {
	// 创建一个可取消的上下文
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // 确保资源释放

	// 启动两个协程，监听取消信号
	go func(ctx context.Context) {
		fmt.Println("A Begin")
		<-ctx.Done() // 等待取消信号
		fmt.Println("A End")
	}(ctx)

	go func(ctx context.Context) {
		fmt.Println("B Begin")
		<-ctx.Done() // 等待取消信号
		fmt.Println("B End")
	}(ctx)

	// 启动另一个协程，5秒后取消上下文
	go func(ctx context.Context) {
		fmt.Println("等待5秒退出")
		time.Sleep(5 * time.Second)
		cancel() // 5秒后触发取消
	}(ctx)

	<-ctx.Done() // 等待取消信号
	fmt.Println("Main End")

}
```
