# 写入程序修改过的内容

## 启动方式

- `Restart=on-failure` 改为 `Restart=always`

```shell
systemctl status dbwriter

dbwriter.service - dbwriter
     Loaded: loaded (/lib/systemd/system/dbwriter.service; enabled; preset: enabled)
     Active: active (running) since Mon 2025-12-15 09:41:48 CST; 4min 39s ago
    Process: 2284722 ExecStartPre=/bin/sleep 5 (code=exited, status=0/SUCCESS)
   Main PID: 2284745 (dbwriter)
      Tasks: 12 (limit: 4407)
     Memory: 7.5M
     CGroup: /system.slice/dbwriter.service
             └─2284745 /home/root/dbwriter/dbwriter
```

