# Docker

## 安装

:::tip 提示
测试环境: ``ubuntu 1804``

如果使用的是``root``用户,无需加``sudo``
:::

:::danger 注意
执行``sudo usermod -aG docker $USER``后一定要**注销当前用户**或**重启**,否则执行过程中会出现一系列权限问题。
:::

```shell{5-6}
# 为最新版本
$ sudo apt-get update 
# 安装
$ sudo apt install docker.io
# 将当前用户加入docker组， 加入后需要注销或重启
$ sudo usermod -aG docker $USER
# 从网上下载
$ wget https://github.com/docker/compose/releases/download/v2.11.2/docker-compose-linux-x86_64 
# 移动至/usr/local/bin/下
$ sudo cp docker-compose-linux-x86_64 /usr/local/bin/docker-compose
# 增加权限
$ sudo chmod +x /usr/local/bin/docker-compose
```

## 常用命令

- docker
	1. ``sudo docker network ls`` 查看**docker网络列表**。
	1. ``sudo docker network rm 网络名``**删除网络**。
	1. ``docker ps``查看**docker容器运行情况**。
	1. ``docker exec -it 容器 /bin/bash``**进入容器**。
	1. 日志
		- 查看指定日期后的100条日志``docker logs -f -t --since="2023-08-11" --tail=100 容器``
		- 查看指定时间后的日志``docker logs -t --since="2023-08-11T15:20:20" 容器``
		- 查看指定时间段日志``docker logs -t --since="2023-08-11T15:20:20" --until "2023-08-11T15:30:20" 容器``
		- 实时查看后100条日志``docker logs -f --tail=100 容器``
		- 查看30分钟日志: ``docker logs --since 30m 容器``


- docker-compose

	1. 运行``docker-compose -f 配置文件 up -d``
	1. 关闭容器``docker-compose -f 配置文件 down``
	1. 查看运行容器配置文件位置``docker-compose ls``

## 运行第一个docker-compose

1. 创建``demo1.yaml``文件并写入以下内容:
	
   ```yaml
    version: '3'
    services:
      demo1:
        image: praqma/network-multitool
        container_name: demo1
        restart: always
    ```

1. 运行``docker-compose -f demo1.yaml up -d``
1. 查看运行列表``docker ps``
1. 进入容器``docker exec -it demo1 /bin/bash``
1. 使用``ping www.aliyun.com``
1. 退出``exit``
1. 关闭容器``docker-compose -f demo1.yaml down``
