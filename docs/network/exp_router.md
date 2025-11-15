# 示例: 路由器

## 注意事项

- `lan0` 口设置`ip`作为网关地址
- `eth0` 不要设置`ip`与自动获取

## 连接示意图

@startuml
cloud {
    [Internet]
}



component switch {
    port sw1
    port sw2
    port sw3
}

component router {
    port eth0
    port lan0
}
Internet --> eth0
lan0 --> sw1


component pc1 {
    port eno1
}
sw2 -> eno1

component pc2 {
    port eno2
}
sw3 -> eno2

@enduml

## 网络连接

- [PPPOE拨号](./network.md#PPPOE连接)
- 静态ip直接用`nmtui`

## 设置本机`DNS`

- `/etc/resolv.conf`

```shell
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
# 加锁
sudo chattr +i /etc/resolv.conf
# 解锁
# sudo chattr -i /etc/resolv.conf
```

## 开启路由转发

1. 修改配置文件`sudo vi /etc/sysctl.conf`

    > 打开`net.ipv4.ip_forward=1`

    ```ini
    #net.ipv4.ip_forward=1
    net.ipv4.ip_forward=1
    ```

1. 生效

    ```shell
    sudo sysctl -p
    ```

## 配置NAT(内网共享网络)

1. 给出网的数据包做`源地址伪装`，让它们看起来像是从这台机器`ppp0`发出去的

    ```shell
    sudo iptables -t nat -A POSTROUTING -o ppp0 -j MASQUERADE
    ```

    - `-t nat`：使用 NAT 表（网络地址转换）
    - `-A POSTROUTING`：在数据包即将离开本机时处理
    - `-o ppp0`：目标接口是 ppp0（拨号上网的接口）
    - `-j MASQUERADE`：对源地址做伪装（动态 IP 场景常用）

    :::tip 通俗解释
    内网设备发出的数据通过这台机器出网时，会统一使用本机的公网 IP 地址出去，从而实现多个设备共享一个外网 IP。
    :::

1. 允许内网流量从`lan0`进入，然后通过`ppp0`转发出去

    ```shell
    sudo iptables -A FORWARD -i lan0 -o ppp0 -j ACCEPT
    ```

    - `-A FORWARD`：作用于转发链（不是本机本地通信，而是路由转发）
    - `-i lan0`：数据包来自内网接口（lan0）
    - `-o ppp0`：要转发到外网接口（ppp0）
    - `-j ACCEPT`：允许该流量通过

1. 允许外部网络对已经建立连接的数据进行回应返回到内网设备

    ```shell
    sudo iptables -A FORWARD -i ppp0 -o lan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
    ```

    - `-i ppp0`：数据包来自外网接口（ppp0）
    - `-o lan0`：要转发到内网接口（lan0）
    - `-m state`：使用状态匹配模块
    - `--state RELATED,ESTABLISHED`：只允许响应性的流量（不是新连接）
    - `-j ACCEPT`：允许通过

1. 保存`iptables`规则（防止重启失效）

    ```shell
    # 安装
    # sudo apt install iptables-persistent
    sudo netfilter-persistent save
    ```


## DHCP服务器(可选)

- 安装

    ```shell
    sudo apt install isc-dhcp-server
    ```

- 配置

    ```shell
    subnet 172.16.1.0 netmask 255.255.255.0 {
      range 172.16.1.1 172.16.1.50;
      option routers 172.16.1.254;
      option domain-name-servers 8.8.8.8, 114.114.114.114;
    }
    ```

- 配置说明

    ```shell
    subnet 网段 netmask 子网掩码 {
      range 启始 结束;
      option routers 本机;
      option domain-name-servers 8.8.8.8, 114.114.114.114;
    }
    ```

## 创建启动自恢复脚本

- 脚本 `/usr/local/bin/router-setup.sh`

```shell
#!/bin/bash

# 等待 ppp0 接口上线
for i in {1..300}; do
    if ip a show ppp0 &>/dev/null; then
        echo "[router-setup] ppp0 is ready"
        break
    fi
    sleep 1
done

# 添加默认路由
ip route del default 2>/dev/null
ip route add default dev ppp0

# 启动 DHCP 服务
systemctl restart isc-dhcp-server

# 同步时间
systemctl restart systemd-timesyncd

sleep 2

# 启动 ddns 服务
systemctl stop ddns.service
systemctl start ddns.service
```

- 添加执行权限

```shell
sudo chmod +x /usr/local/bin/router-setup.sh
```

- 安装服务

```shell
sudo vim /etc/systemd/system/router-setup.service
```

```shell
[Unit]
Description=Post-ppp0 network router setup
After=network-online.target
Wants=network-online.target

[Service]
User=root
ExecStart=/usr/local/bin/router-setup.sh
Type=oneshot
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
```

```shell
sudo systemctl enable router-setup.service
sudo systemctl start router-setup.service
```

## ddns 

- 下载

```shell
mkdir ddns && cd ddns
curl -JLO https://github.com/jeessy2/ddns-go/releases/download/v6.9.1/ddns-go_6.9.1_linux_arm64.tar.gz
tar vxzf ddns-go_6.9.1_linux_arm64.tar.gz
```

- 检查时间同步

> 如果与以下内容不符合以下内容使用`sudo apt install systemd-timesyncd -y`安装时间同步

```shell{4-5}
timedatectl status
#                 ...
# 
# System clock synchronized: yes                        
#               NTP service: active      
```

- 运行

```shell
./ddns-go
```

- 使用浏览器打开`ip:9876`, 填写相关信息,`Domains`填写域名可以是多条,[其他信息参考](https://cloud.tencent.com/developer/article/2306595)

- 注册成为服务

```shell
sudo nano /etc/systemd/system/ddns.service
```

```shell
[Unit]
Description=DDNS Client
After=network.target

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
ExecStart =/root/tools/ddns/ddns-go -l 172.16.1.254:9876
ExecReload=/root/tools/ddns/ddns-go -l 172.16.1.254:9876
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```
