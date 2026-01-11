# 我们爱科学

:::tip 提示
实验环境为`ubuntu 1804`
:::

- 创建目录

```shell
sudo mkdir -p /etc/systemd/system/docker.service.d
```

- 设置 `sudo vim /etc/systemd/system/docker.service.d/proxy.conf`

	> 其中`http://127.0.0.1:7890/`改为你爱科学的地址

```shell
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:7890/"
Environment="HTTPS_PROXY=http://127.0.0.1:7890/"
Environment="NO_PROXY=localhost,127.0.0.1,.example.com"
```

- 重启服务

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```
