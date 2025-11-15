# iptables 防火墙

## 名词

- **表(table)**: 用于存放**链**, `iptables`的功能模块集合(如`filter`,`nat`)
- **链(chain)**: 用于存放**规则**, 表中的执行流程（如`INPUT`, `OUTPUT`）
- **规则(policy)**: 允许(ACCEPT),拒绝(REJECT),忽略(DROP)条目,针对数据包进行匹配判断.

## 匹配规则

1. 规则按顺序依次执行。
1. 匹配成功（如`DROP`或`ACCEPT`）后立即终止后续匹配。
1. 所有规则都不匹配时，将执行该链的默认策略（policy）,通常情况下只会修改默认`INPUT DROP`,其他不建议改动。

    :::warning 注意(不建议修改)

    如果要修改`INPUT 为 DROP`要设置`ssh`为开放状态,否则导致`ssh`无法连接

    - 修改默认
    
    ```shell{4}
    sudo iptables -L -n -v
    # Chain INPUT (policy ACCEPT 0 packets, 0 bytes) 默认允许
    # 设置 INPUT 默认策略为 DROP（推荐生产使用）,其中 -P 代表: policy
    sudo iptables -P INPUT DROP
    # 设置 FORWARD 默认策略为 ACCEPT（如启用路由转发）: 作为路由器里
    sudo iptables -P FORWARD ACCEPT
    ```

    - 开放ssh

    ```shell
    sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
    # or
    sudo iptables -A INPUT -s 172.16.1.0/24 -p tcp --dport 22 -j ACCEPT
    ```

1. 拒绝规则建议放在靠前位置，提高效率与安全性。


## 四表五链（简明）

:::tip 提示 只列出最常用的部分，其他链较少用。 

1. `filter`过滤表（默认表，处理包的允许/拒绝）
    - `INPUT`过滤主机的数据包
    - `OUTPUT`：由本机发出的数据包
    - `FORWARD`路过，转发数据包，与nat相关。

1. `nat`映射表（地址转换，常用于端口映射）

    - `PREROUTING`：数据包进入前修改目标地址
    - `POSTROUTING`：数据包离开前修改源地址

:::


## 工作流程图

![iptables](/network/iptables.svg)

## 实验

::: tip 提示
以下测试环境为: 
- 电脑A(防火墙机): `192.168.12.180`
- 电脑B(普通主机ssh电脑C): `192.168.12.183`
- 电脑C(测试机): `192.168.42.10`
- **电脑B**通过ssh连接**电脑C**后不停`ping`**电脑A**
:::

```shell
# 查看filter(默认表)的当前规则
sudo iptables -nL

# 查看指定表的当前规则iptables -nL -t 表名
sudo iptables -nL -t nat

# 屏蔽来自某 IP 的请求
sudo iptables -t filter -I INPUT -s 192.168.42.10 -j DROP
# > ping 会直接停住

# 删除一条规则（按序号）
sudo iptables -D INPUT 1
# > ping 恢复

# 允许
sudo iptables -t filter -I INPUT -s 192.168.42.10 -j ACCEPT
# > ping 恢复

# 拒绝
sudo iptables -t filter -I INPUT -s 192.168.42.10 -j REJECT
# > ping 的提示会变成 Destination Port Unreachable

# 屏蔽一个网段
sudo iptables -t filter -I INPUT -s 192.168.42.0/24 -j DROP
# > ping 会直接停住

# 禁止192.168.42.0/24访问22端口
sudo iptables -t filter -I INPUT -s 192.168.42.0/24 -p tcp --dport 22 -j DROP
# > ping 可以通 ssh 会卡住
sudo iptables -t filter -I INPUT -s 192.168.42.0/24 -p tcp --dport 22 -j REJECT
# > ping 可以通 ssh 会提示 Connection refused

# 只允许指定网段接入
sudo iptables -t filter -I INPUT ! -s 192.168.12.0/24 -j DROP
# > ping 会直接停住

# 禁止 ping
sudo iptables -I INPUT -p icmp -j DROP

# 限制 ping 速率
sudo iptables -I INPUT -p icmp -m limit --limit 10/minute -j DROP

# 修改默认策略（如放通转发）
sudo iptables -P FORWARD ACCEPT
```

## 生产配置(建议)

```shell
# 允许 SSH 端口（22）
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许本地回环接口
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT

# 允许 Web 服务端口
sudo iptables -A INPUT -m multiport -p tcp --dport 80,443 -j ACCEPT

# 开放内网访问
sudo iptables -A INPUT -s 172.16.1.0/24 -j ACCEPT

# 放通已建立的连接
sudo iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
```

## 保存(开机自动生效)

```shell
# 安装
# sudo apt install iptables-persistent
sudo netfilter-persistent save
```

## 导出与恢复

```shell
# 导出
sudo iptables-save > ~/iptables.rules
# 恢复
sudo iptables-restore < ~/iptables.rules
```
