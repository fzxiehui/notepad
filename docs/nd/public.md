# 公共步骤

## 网络

- 代理
```shell
export https_proxy=http://192.168.2.9:7890 http_proxy=http://192.168.2.9:7890 all_proxy=socks5://192.168.2.9:7890

export https_proxy=http://IP:7890 http_proxy=http://IP:7890 all_proxy=socks5://IP:7890
```

- 网络

```shell
sudo ifconfig eno2 192.168.2.9
sudo ip route add 192.168.2.0/24 dev eno2
ip route show | grep 192.168.2
ssh root@192.168.2.2
```

- 服务重新部署(新版本)

```shell
systemctl disable hpweb hpweb_broadcast hpweb_ota hpweb_socket
systemctl stop hpweb hpweb_broadcast hpweb_ota hpweb_socket
rm /usr/lib/systemd/system/hpweb*
find /web -mindepth 1 ! -name 'lost+found' -exec rm -rf {} +
rm /data/config/hpweb.db
tar xzf /data/output.tar.gz -C /web
cp /web/systemd/* /usr/lib/systemd/system/
systemctl enable hpweb hpweb_broadcast hpweb_ota hpweb_socket
systemctl start hpweb hpweb_broadcast hpweb_ota hpweb_socket
```

- 重新挂载

```shell
mount -o remount,rw /web
```

- 服务重新部署

```shell
cd /data/
systemctl stop hpweb
rm /web/app -rf
rm /data/config/hpweb.db
tar -vzxf build.tar.gz -C /web/
systemctl start hpweb
journalctl -u hpweb -f
```

- 重启相关服务

```shell
systemctl restart master-can-router
systemctl restart someip-to-zmq

systemctl stop master-can-router
systemctl start master-can-router

systemctl stop someip-to-zmq
systemctl strat someip-to-zmq
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


- 串口使用

```shell
sudo picocom -b 115200 /dev/ttyUSB0 
```

## 数据库


```sql
desc 可以看表结构
```

## 开启行缓存

```shell
alter database bms_db cachemodel 'last_row';
```
