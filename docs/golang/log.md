# log

## 日志实验

> 参考
- 《Go 每日一库之 log》：`https://darjun.github.io/2020/02/07/godailylib/log/`
- 《控制台\033方式设置字体颜色》：`https://blog.csdn.net/qq_42372031/article/details/104137272`

```go
package main

import (
	"fmt"
	"log"
)

func main() {
	fmt.Println("go")

	log.SetPrefix("\033[32m[Dubug] \033[0m")
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime)
	log.Println("hello")
	log.Println("hello")
	log.Println("hello")

	log.SetPrefix("\033[31m[Error] \033[0m")
	log.Println("hello")
	log.Println("hello")
	log.Println("hello")

	log.Fatal("Fatal")
	fmt.Println("go") // 不会被执行
}
```
