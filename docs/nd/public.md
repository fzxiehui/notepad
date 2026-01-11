# 公共步骤

## 网络

- 代理
```shell
export https_proxy=http://192.168.2.9:7890 http_proxy=http://192.168.2.9:7890 all_proxy=socks5://192.168.2.9:7890
```

- 网络

```shell
sudo ifconfig eno2 192.168.2.9
sudo ip route add 192.168.2.0/24 dev eno2
ip route show | grep 192.168.2
ssh root@192.168.2.89
```

- 部署

```shell
cd /home/root/webtest && ./test.sh

# 停止广播
systemctl stop hpweb_broadcast

# 开启广播
systemctl start hpweb_broadcast

# 重启dbwriter
systemctl restart dbwriter
```

- 注册的服务

```shell
hpweb_broadcast
hpweb_socket
hpweb
```

- docker 

```shell
docker exec -it tdengine  /bin/bash
```

- 数据库

```shell
taos
use bms_db;
```

## 数据库


```sql
desc 可以看表结构
```

## 开启行缓存

```shell
alter database bms_db cachemodel 'last_row';
```
