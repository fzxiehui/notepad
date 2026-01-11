# 小数运算

## 示例

- 安装库

	```shell
	go get github.com/shopspring/decimal
	```

- 示例代码

```go
package main

import (
	"fmt"

	"github.com/shopspring/decimal"
)

func main() {
	var a = decimal.NewFromFloat(0.125)
	var b = decimal.NewFromFloat(0.235)

	a_add := a.Add(b) // 加
	a_sub := a.Sub(b) // 减
	a_mul := a.Mul(b) // 乘
	a_div := a.Div(b) // 除

	fmt.Println(a_add)
	fmt.Println(a_sub)
	fmt.Println(a_mul)
	fmt.Println(a_div)

	// 四舍五入, 保留两位小数
	fmt.Println(a.Round(2).Float64()) // 0.13 false
	// 舍弃, 保留两位小数
	fmt.Println(a.Truncate(2).Float64()) // 0.12 false
}

```

