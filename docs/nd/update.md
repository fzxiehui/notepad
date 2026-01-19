# 更新

## 手动部署

```shell
root@mbmu-demostic:~# cat webtest/test.sh 
mkdir -p temp
rm -rf temp/*
tar -xf ./build.tar.gz -C ./temp
cd temp
/web/usrbin/python/bin/python install_ubuntu.py --cmd=uninstall
/web/usrbin/python/bin/python install_ubuntu.py --cmd=install
```

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


## 临时升级

- 改进版

> 改进原因, 本地代理导致无法访问grpc

```shell
root@ubuntu:/etc# cat /usr/lib/systemd/system/otaweb.service 
## 临时升级
[Unit]
Description=OTA Web Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/web
ExecStart=/web/usrbin/python/bin/python /web/app.py
Restart=on-failure
RestartSec=5s
LimitNOFILE=1048576

Environment=PYTHONUNBUFFERED=1
Environment=NO_PROXY=127.0.0.1,localhost

[Install]
WantedBy=multi-user.target
root@ubuntu:/etc# 
```

```ini
root@mbmu-demostic:~# cat /web/app/app/script/deploy/otaweb.service 
[Unit]
Description=OTA Web Service
After=network.target

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
ExecStart=/web/usrbin/python/bin/python /web/app.py
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```
