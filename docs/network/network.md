# 常用设置

## `ip`设置

```shell
nmtui
```

## PPPOE连接

:::tip 注意
用于PPPOE接口,不要设置自动获取IP
:::

> 在 `Ubuntu` 上使用 `PPPoE`（点对点协议以太网）连接宽带


1. **安装 pppoeconf 工具**

    ```bash
    sudo apt update
    sudo apt install pppoe pppoeconf
    ```

1. **运行配置工具(全`Yes`)**

    ```bash
    sudo pppoeconf
    ```

    这会启动一个向导，自动检测网络接口并配置`PPPoE`。输入：

    - 用户名(先删除`username`再开始输入)
    - 密码
    - 是否自动连接（推荐选“是”）

1. **连接 `PPPoE`**

    ```bash
    sudo pon dsl-provider
    ```

1. **断开连接**

    ```bash
    sudo poff dsl-provider
    ```

1. **查看连接状态**

    ```bash
    plog
    ```

1. 连接日志

    ```shell
    journalctl -xe | grep ppp
    # or 
    tail -f /var/log/syslog | grep ppp
    ```

1. 异常排查

    - 确认物理链路

        ```shell
        ethtool eth0
        # 确保有 "Link detected: yes"
        ```

    - 手动测试是否能发现`AC`

        ```shell
        sudo pppoe-discovery -I eth0
        # Access-Concentrator: xxx
        # AC-Ethernet-Address: xx:xx:xx:xx:xx:xx
        ```

## DHCP服务

- 安装

```bash
sudo apt install isc-dhcp-server
```

- 配置`/etc/dhcp/dhcpd.conf`

```shell
subnet 172.16.1.0 netmask 255.255.255.0 {
  range 172.16.1.1 172.16.1.50;
  option routers 172.16.1.254;
  option domain-name-servers 8.8.8.8, 114.114.114.114;
}
```
