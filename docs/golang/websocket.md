# Go Web Socket

## Gin & Web Socket 示例

- 安装库

	```shell
	# gin
	go get -u github.com/gin-gonic/gin

	# gorilla
	go get github.com/gorilla/websocket
	```

- 服务示例代码

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upGrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func chat(c *gin.Context) {
	// 升级 get 请求, 为 webSocket 协议
	ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer ws.Close()
	for {
		// 读取ws中的数据
		mt, message, err := ws.ReadMessage()
		if err != nil {
			break
		}
		// 写入ws数据
		err = ws.WriteMessage(mt, message)
		if err != nil {
			break
		}
	}
}

func main() {
	r := gin.Default()
	r.GET("/v1/chat", chat)
	r.Run(":8081")
}
```

## Web Socket 连接及连接管理

::: details 点击查看完整代码
```go
package wsconnectmanager

import (
	"errors"
	"sync"

	"github.com/fzxiehui/wx_serve/log"
	"github.com/gorilla/websocket"
)

/*
 * Web Socket 连接
 */
type WsConnect struct {
	ID     uint            // 连接ID 同时绑定为用户id
	WS     *websocket.Conn // web socket 通信套接字
	Status bool            // 连接状态， 在线、离线
}

/*
 * 创建一个连接
 */
func NewWsConnect(id uint, ws *websocket.Conn, status bool) *WsConnect {
	conn := WsConnect{
		ID:     id,
		WS:     ws,
		Status: status,
	}
	go conn.ReadMessage()
	return &conn
}

/*
 * 关闭连接
 */
func (ws *WsConnect) Close() error {
	err := ws.WS.Close()
	if err != nil {
		return err
	}
	ws.Status = false
	return nil
}

/*
 * 发送信息
 */
func (ws *WsConnect) WriteMessage(data *[]byte) error {
	err := ws.WS.WriteMessage(websocket.TextMessage, *data)
	if err != nil {
		log.Error("WriteMessage Error: ", err)
		ws.Close()
		return err
	}
	return nil
}

/*
 * 接收信息，阻塞等待
 * 在异常时发出中断信号, 使连接断开
 * @TODO 系统中无 接收需要 未实现 ReadHook
 */
func (ws *WsConnect) ReadMessage() {
	// _, _, err := ws.WS.ReadMessage()
	for {
		mt, messages, err := ws.WS.ReadMessage()
		if err != nil {
			log.Error("ReadMessage Error ! Disconnection ID:", ws.ID)
			break
		}
		log.Debugf(
			"ReadMessage: ClientID: %d,\n ReadBufferSize: %d,\n Buffers: %s\n",
			ws.ID, mt, messages)

	}
	ws.Close()

}

/*
 * Web Socket 连接管理器对外接口
 */
type WsConnectManager interface {

	// 通过 ID 关闭一个连接
	// CloseConnectByID(id uint) error

	// 通过 ID 获取一个连接
	GetConnectByID(id uint) (*WsConnect, error)

	// 连接数量
	Len() int

	// 添加一个连接
	Insert(c *WsConnect) error

	// 通过 ID 删除一个连接
	DeleteConnectByID(id uint) (*WsConnect, error)
}

/*
 * 新建连接管理器
 */
func NewWsConnectManager() WsConnectManager {
	return &wsConnectManager{
		connects: make(map[uint]*WsConnect),
	}
}

/*
 * 连接管理器实现
 */
type wsConnectManager struct {
	// connectList []WsConnect  // 连接列表
	connects map[uint]*WsConnect // 连接列表
	lock     sync.RWMutex        // 连接操作锁
}

// 添加一个连接
func (m *wsConnectManager) Insert(c *WsConnect) error {
	m.lock.Lock()
	defer m.lock.Unlock()
	m.connects[c.ID] = c
	return nil
}

// 通过 ID 获取一个连接
func (m *wsConnectManager) GetConnectByID(id uint) (*WsConnect, error) {
	log.Debug("GetConnectByID Begin")
	m.lock.RLock()
	defer m.lock.RUnlock()
	if conn, ok := m.connects[id]; ok {
		log.Debug("GetConnectByID Success")
		return conn, nil
	}
	log.Debug("GetConnectByID Error")

	return nil, errors.New("没有ID对应的连接")

}

// 连接数量
func (m *wsConnectManager) Len() int {
	return len(m.connects)
}

// 通过 ID 删除一个连接
func (m *wsConnectManager) DeleteConnectByID(id uint) (*WsConnect, error) {
	// delete(m.connects, id)
	conn, err := m.GetConnectByID(id)
	if err != nil {
		return nil, err
	}
	m.lock.Lock()
	defer m.lock.Unlock()
	delete(m.connects, id)
	return conn, nil
}
```
:::
