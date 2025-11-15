# ip & Port

## ip扫描

- `nmap` 

```shell
# sudo apt install nmap
nmap -sn 192.168.1.0/24
```

- `fping` 

```shell
# sudo apt install fping
fping -a -g 192.168.1.1 192.168.1.255
```

- `arp`

> 前题条件: 已存在路由表中(有过通信)

```shell
# sudo apt install net-tools
arp -a
```

## 端口

- 占用查看

	```shell
    ss -tulnp | grep 8080
	sudo netstat -tulnp | grep 8080
	```

- 端口扫描(超快)

    ```shell
    nmap -T4 -p- --open -Pn 192.168.1.1
    # 如果加上  -sV 更全面
    # 其中 -p- = 全部端口 1 - 65535
    # -Pn ping 不通也继续扫描
    # -T4  = 0 - 5 速度
    # --open 只显示开放的端口信息
    # nmap -T4 -p- --open -Pn -sV 192.168.1.1
    ```

- 端口扫描

	```shell
	# nc -z -v -w 1 {ip} {start_port}-{start_port} 2>&1 | grep succeeded 
	# e.g.
	nc -z -v -w 1 192.168.1.1 9000-10000 2>&1 | grep succeeded
	```

## 路由分析

> 在`windows`环境中使用 `tracert`代替

- `mtr`

```shell
mtr 8.8.8.8
```

