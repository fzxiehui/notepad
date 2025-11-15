# 代理

> - @TODO: docker 部署
> - @TODO: socketio, web socket
> - @TODO: 前端路由方式影响

## nginx

> 只适用于 http

- 安装

```shell
sudo apt install nginx
```


## HAProxy

- 安装

```shell
sudo apt install haproxy
```

- 示例(远程连接), 在`/etc/haproxy/haproxy.cfg`末尾追加.

```ini
frontend tcp_proxy
	bind *:3389
	mode	tcp
	default_backend rdp_servers

backend rdp_servers
	mode	tcp
	server rdp1 172.16.1.89:3389 check
```

- 推荐做法

> haproxy 配置文件不支持分文件编写, 所有可以使用以下方法进行分文件配置

```shell
# 创建配置目录
sudo mkdir -p /etc/haproxy/config

# ! 第一次把默认的配置文件放到config项目中
sudo cat /etc/haproxy/haproxy.cfg > /etc/haproxy/config/00-defaults.cfg

# 可以添加新配置 xx.cfg 到 /etc/haproxy/config/
# ... 

# 应用新配置
sudo cat /etc/haproxy/config/*.cfg > /etc/haproxy/haproxy.cfg
sudo systemctl restart haproxy.service
# 或 systemctl reload haproxy # 安全平滑更新
```

