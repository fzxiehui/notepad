# 常用服务docker-compose配置

## GitEA

::: details 点击查看配置文件
```yaml
services:
  server:
    image: gitea/gitea:1.22.3
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
    restart: always
    networks:
      dev:
        ipv4_address: 10.0.0.253
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"

networks:
  dev:
    name: dev
    driver: bridge
    ipam:
      config:
        - subnet: 10.0.0.0/24
          gateway: 10.0.0.254
```
:::

## MySQL

::: details 点击查看配置文件
```yaml
services:
  mysql:
    image: mysql:5.7
    ports:
      - '3306:3306'
    volumes:
      - ./data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: test
      MYSQL_USER: test
      MYSQL_PASSWORD: test
    container_name: appmysql
    restart: always
    # depends_on:
    #   - redis
    command:
      - mysqld
      - --default-time-zone=Asia/Shanghai
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
```
:::

## Redis

::: details 点击查看配置文件
```yaml
services:
  redis:
    image: redis:7.0
    command: redis-server
    restart: always
    networks:
      dev:
        ipv4_address: 10.0.0.252
    ports:
      - 6379:6379
    volumes:
      - ./data:/data
      
networks:
  dev:
    external: true
```
:::

## EMQX

::: details 点击查看配置文件
```yaml
services:
  emq:
    image: emqx/emqx:5.0.3
    restart: always
    container_name: emqx-docker
    # network_mode: docker-net
    privileged: true
    volumes:
      - ./conf:/opt/emqx/etc
      - ./data:/opt/emqx/data
        #      - ./logs:/opt/emqx/log
    ports:
      # MQTT 协议端口
      - 1883:1883
      # MQTT/SSL 端口
      - 8883:8883
      # MQTT/WebSocket 端口
      - 9083:8083
      # MQTT/WebSocket/SSL 端口
      - 8084:8084
      # 管理 API 端口
      - 8081:8081
      # Dashboard 端口
      - 18083:18083
```
:::

## SVN

- 启动后 url `ip:13690/svnadmin`
- Subversion authorization file : `/etc/subversion/subversion-access-control`
- User authentication file (SVNUserFile) : `/etc/subversion/passwd`
- Parent directory of the repositories (SVNParentPath) : `/home/svn`
- Subversion client executable : `/usr/bin/svn`
- Subversion admin executable : `/usr/bin/svnadmin`
```shell
mkdir config
mkdir repo
touch config/passwd
echo "[groups]" >> config/subversion-access-control
echo >> config/subversion-access-control
echo "[/]" >> config/subversion-access-control
echo "* = r" >> config/subversion-access-control
chmod -R a+w config/
chmod -R a+w repo/
```

::: details 点击查看配置文件
```yaml
services:
  svn:
    container_name: svn
    image: elleflorio/svn-server:issue-19
    restart: always
    volumes: 
      - ./repo/:/home/svn/:rw
      - ./config/:/etc/subversion/:rw
      - /etc/localtime:/etc/localtime:ro
    ports:
      - 3690:3690
      - 13690:80
```
:::


## VerneMQ

::: details 点击查看配置文件
```yaml
services:
  vernemq:
    image: vernemq/vernemq:2.1.2
    container_name: vernemq
    restart: always
    networks:
      dev:
        ipv4_address: 10.0.0.251
    ports:
      - "1883:1883"     # MQTT
      - "8883:8883"     # MQTT SSL
      - "8080:8080"     # Webhook / HTTP
    environment:
      # 最终用户许可协议 (必须)
      - DOCKER_VERNEMQ_ACCEPT_EULA=yes
      # 允许匿名（测试阶段建议开，生产关）
      - DOCKER_VERNEMQ_ALLOW_ANONYMOUS=on

      # listener
      - DOCKER_VERNEMQ_LISTENER__TCP__DEFAULT=0.0.0.0:1883

      # 日志
      - DOCKER_VERNEMQ_LOG__CONSOLE=console

      # ==== HTTP AUTH（认证）====
      # - DOCKER_VERNEMQ_PLUGINS__VMQ_HTTP_AUTH=on
      # - DOCKER_VERNEMQ_VMQ_HTTP_AUTH__HTTP_ENDPOINT=http://host.docker.internal:9000/auth
      # - DOCKER_VERNEMQ_VMQ_HTTP_AUTH__HTTP_METHOD=post

      # ==== ACL（权限）====
      # - DOCKER_VERNEMQ_VMQ_HTTP_AUTH__ACL_ENDPOINT=http://host.docker.internal:9000/acl

      # ==== Webhook（上下线事件）====
      # - DOCKER_VERNEMQ_PLUGINS__VMQ_WEBHOOKS=on
      # - DOCKER_VERNEMQ_VMQ_WEBHOOKS__WEBHOOK__ENDPOINT=http://host.docker.internal:9000/webhook

      # ==== Hook 开启 ====
      # - DOCKER_VERNEMQ_VMQ_WEBHOOKS__WEBHOOK__HOOKS=on_client_connected,on_client_disconnected

    volumes:
      - ./data:/vernemq/data
      - ./log:/vernemq/log
networks:
  dev:
    external: true
```
:::


## MQTT

- `mkdir -p ./mqtt/config`
- `cd mqtt`

- `docker-compose.yaml`
::: details 点击查看配置文件
```yaml
services:
  mosquitto:
    image: iegomez/mosquitto-go-auth:3.0.0-mosquitto_2.0.18
    container_name: mosquitto
    restart: always
    networks:
      dev:
        ipv4_address: 10.0.0.251

    ports:
      - "1883:1883"

    volumes:
      - ./config/mosquitto.conf:/etc/mosquitto/mosquitto.conf:ro

    environment:
      TZ: Asia/Shanghai

networks:
  dev:
    external: true
```
:::

- `./config/mosquitto.conf`

```ini
listener 1883

allow_anonymous false

plugin /mosquitto/go-auth.so

# 使用 HTTP 认证
auth_opt_backends http

# 是否启用超级用户(默认启用)
auth_opt_disable_superuser true

# HTTP 服务地址
auth_opt_http_host 10.0.0.254
auth_opt_http_port 7771

# 接口
auth_opt_http_getuser_uri /api/mqtt/auth
auth_opt_http_aclcheck_uri /api/mqtt/acl
auth_opt_http_superuser_uri /api/mqtt/superuser

# 请求参数格式
auth_opt_http_params_mode json

# 返回格式
auth_opt_http_response_mode json

# 超时时间
auth_opt_http_timeout 5

# 请求方法
auth_opt_http_method POST

log_dest stdout
log_type all
```

- go gin server

```go
package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

type AuthResponse struct {
	Ok    bool   `json:"ok"`
	Error string `json:"error"`
}

func main() {
	r := gin.Default()

	// 认证
	r.POST("/api/mqtt/auth", func(c *gin.Context) {
		var req map[string]interface{}
		_ = c.ShouldBindJSON(&req)

		log.Printf("[AUTH] %+v", req)

		c.JSON(200, AuthResponse{
			Ok:    true,
			Error: "",
		})
	})

	// 认证
	r.POST("/api/mqtt/superuser", func(c *gin.Context) {
		var req map[string]interface{}
		_ = c.ShouldBindJSON(&req)

		log.Printf("[AUTH] %+v", req)

		c.JSON(200, AuthResponse{
			Ok:    true,
			Error: "",
		})
	})

	// ACL
	r.POST("/api/mqtt/acl", func(c *gin.Context) {
		var req map[string]interface{}
		_ = c.ShouldBindJSON(&req)

		log.Printf("[ACL] %+v", req)

		c.JSON(200, AuthResponse{
			Ok:    true,
			Error: "",
		})
	})

	log.Println("mqtt auth server listening on :7771")
	if err := r.Run(":7771"); err != nil {
		panic(err)
	}
}
```
