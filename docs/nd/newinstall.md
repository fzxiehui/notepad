# 新安装

## 历史测试功能清除

```shell
# 停止并移除测试服务
systemctl stop otaweb
systemctl disable otaweb
rm /usr/lib/systemd/system/otaweb.service

# 删除测试内容
cd /web && ls -A | grep -v '^lost+found$' | xargs rm -rf
```

## 历史服务

```shell
systemctl stop hpwebt
systemctl stop hpweb_broadcast
systemctl stop hpweb_socket
systemctl stop hpweb
```


## 构建脚本

```make
.PHONY: build rely py send package

clean:
	rm -rf output

py:
	@echo "tar usrbin ..."
	tar -zcf output/usrbin.tar.gz usrbin/* -C .
	@echo "install: tar -vxzf usrbin.tar.gz -C /web"

rely:
	@echo "cp rely ..."
	cp rely/* output/

build:
	mkdir -p output
	@echo "tar otaweb ..."
	tar -zcf output/otaweb.tar.gz otaweb/* -C .
	@echo "install: tar -vxzf otaweb.tar.gz -C /web"
	@echo "copy load sh ..."
	cp 01load.sh output/

send:
	@echo "send test ..."
	scp ./output/* root@192.168.2.2:/data/web/

package:
	@echo "package"
	tar -zcf output/bin.tar.gz output/* -C .
```


## load 脚本

```shell
#!/bin/sh

set -e

# step 1
TD_IMAGE="tdengine/tdengine"
TD_TAR="/data/web/tdengine_3.3.6.9.tar"

# step 2
NGINX_IMAGE="nginx"
NGINX_TAR="/data/web/nginx-1.26-alpine.tar"

# step 3 redis 
REDIS_IMAGE="redis"
REDIS_TAR="/data/web/redis_7.0.tar"

# step 4
OTAWEB_PATH="/web/otaweb"

# step 5
USRBIN_PATH="/web/usrbin"

# step 6
APP_PATH="/web/app"

# step 7
DATABASE="/data/config/hpweb.db"
PYTHON_EXE="/web/usrbin/python/bin/python"
INSTALL_PY="/web/install.py"

echo "====== step 1: check tdengine image ======"
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${TD_IMAGE}:"; then
    echo "tdengine load ..."
    if [ -f "$TD_TAR" ]; then
        docker load -i "$TD_TAR"
        rm -f "$TD_TAR"
        echo "tdengine load success"
    else
        echo "$TD_TAR does not exist !"
    fi
else
    echo "tdengine image exist"
fi

echo "====== step 2: check nginx image ======"
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${NGINX_IMAGE}:"; then
    echo "nginx load ..."
    if [ -f "$NGINX_TAR" ]; then
        docker load -i "$NGINX_TAR"
        rm -f "$NGINX_TAR"
        echo "nginx load success"
    else
        echo "$NGINX_TAR does not exist !"
    fi
else
    echo "nginx image exist"
fi

echo "====== step 3: check redis image ======"
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${REDIS_IMAGE}:"; then
    if [ -f "$REDIS_TAR" ]; then
        echo "redis load ..."
        docker load -i "$REDIS_TAR"
        rm -f "$REDIS_TAR"
        echo "redis load success"
    else
        echo "$REDIS_TAR does not exist !"
    fi
else
    echo "redis image exist"
fi

echo "====== step 4: check otaweb ======"
if [ -d "$OTAWEB_PATH" ]; then
    echo "otaweb install success"
else
    echo "unzip otaweb ..."
    tar zxf /data/web/otaweb.tar.gz -C /web
fi

echo "====== step 5: check usrbin ======"
if [ -d "$USRBIN_PATH" ]; then
    echo "usrbin install success"
else
    echo "unzip usrbin ..."
    tar zxf /data/web/usrbin.tar.gz -C /web
fi

echo "====== step 6: check app ======"
if [ -d "$APP_PATH" ]; then
    echo "app install success"
else
    echo "unzip app ..."
    tar zxf /data/web/build.tar.gz -C /web
fi

echo "====== step 7: check install ======"
if [ -f "$DATABASE" ]; then
    echo "install success ..."
else
    $PYTHON_EXE $INSTALL_PY
fi
echo "====== end ======"
```

