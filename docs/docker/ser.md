# 常用服务docker-compose配置

## GitEA

::: details 点击查看配置文件
```yaml
version: '3'

services:
  server:
    image: gitea/gitea:1.22.3
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
    restart: always
    networks:
      dev:
        ipv4_address: 10.0.0.253
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"

networks:
  dev:
    name: dev
    driver: bridge
    ipam:
      config:
        - subnet: 10.0.0.0/24
          gateway: 10.0.0.254
```
:::

## MySQL

::: details 点击查看配置文件
```yaml
version: '3'

services:
  mysql:
    image: mysql:5.7
    ports:
      - '3306:3306'
    volumes:
      - ./data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: test
      MYSQL_USER: test
      MYSQL_PASSWORD: test
    container_name: appmysql
    restart: always
    # depends_on:
    #   - redis
    command:
      - mysqld
      - --default-time-zone=Asia/Shanghai
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
```
:::

## Redis

::: details 点击查看配置文件
```yaml
version: '3'

services:
  redis:
    image: redis:7.0
    command: redis-server
    restart: always
    networks:
      dev:
        ipv4_address: 10.0.0.252
    ports:
      - 6379:6379
    volumes:
      - ./data:/data
      
networks:
  dev:
    external: true
```
:::

## EMQX

::: details 点击查看配置文件
```yaml
version: '3'

services:
  emq:
    image: emqx/emqx:5.0.3
    restart: always
    container_name: emqx-docker
    # network_mode: docker-net
    privileged: true
    volumes:
      - ./conf:/opt/emqx/etc
      - ./data:/opt/emqx/data
        #      - ./logs:/opt/emqx/log
    ports:
      # MQTT 协议端口
      - 1883:1883
      # MQTT/SSL 端口
      - 8883:8883
      # MQTT/WebSocket 端口
      - 9083:8083
      # MQTT/WebSocket/SSL 端口
      - 8084:8084
      # 管理 API 端口
      - 8081:8081
      # Dashboard 端口
      - 18083:18083
```
:::

## SVN

- 启动后 url `ip:13690/svnadmin`
- Subversion authorization file : `/etc/subversion/subversion-access-control`
- User authentication file (SVNUserFile) : `/etc/subversion/passwd`
- Parent directory of the repositories (SVNParentPath) : `/home/svn`
- Subversion client executable : `/usr/bin/svn`
- Subversion admin executable : `/usr/bin/svnadmin`
```shell
mkdir config
mkdir repo
touch config/passwd
echo "[groups]" >> config/subversion-access-control
echo >> config/subversion-access-control
echo "[/]" >> config/subversion-access-control
echo "* = r" >> config/subversion-access-control
chmod -R a+w config/
chmod -R a+w repo/
```

::: details 点击查看配置文件
```yaml
version: '3'

services:
  svn:
    container_name: svn
    image: elleflorio/svn-server:issue-19
    restart: always
    volumes: 
      - ./repo/:/home/svn/:rw
      - ./config/:/etc/subversion/:rw
      - /etc/localtime:/etc/localtime:ro
    ports:
      - 3690:3690
      - 13690:80
```
:::

