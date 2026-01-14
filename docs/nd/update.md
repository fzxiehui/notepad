# 更新

## 公共步骤
- 代理
```shell
export https_proxy=http://192.168.2.9:7890 http_proxy=http://192.168.2.9:7890 all_proxy=socks5://192.168.2.9:7890
```

- 网络

```shell
sudo ifconfig eno2 192.168.2.9
sudo ip route add 192.168.2.0/24 dev eno2
ssh root@192.168.2.89
```

- uart

```shell
sudo picocom -b 115200 /dev/ttyUSB0
```

- docker 

```shell
docker exec -it tdengine  /bin/bash
```

## web

```shell
cd /home/root/webtest && ./test.sh

# 停止广播
systemctl stop hpweb_broadcast

# 开启广播
systemctl start hpweb_broadcast
```


## dbwriter

```shell
systemctl restart dbwriter
```
