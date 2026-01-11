# alarm 警告

## 历史事件

## 公共步骤

- 代理
```shell
export https_proxy=http://192.168.2.9:7890 http_proxy=http://192.168.2.9:7890 all_proxy=socks5://192.168.2.9:7890
```

- 网络

```shell
sudo ifconfig eno2 192.168.2.9
sudo ip route add 192.168.2.0/24 dev eno2
ssh root@192.168.2.89
```

- docker 

```shell
docker exec -it tdengine  /bin/bash
```

- 数据库

```shell
use bms_db;
desc alarm;
```

## 实时

- 正式

```sql
select * from alarm where recovery_time is null or recovery_time < "2000-01-01 00:00:00.000";
```

- 测试

```sql
select * from alarm;
select * from alarm where recovery_time is null;
select * from alarm where recovery_time is null or recovery_time < fault_time;
select * from alarm where recovery_time is null or recovery_time < "2000-01-01 00:00:00.000";
```


### 历史

- 正式 

```sql

# 类型加等级 故障
select * from alarm where fault_level == 1 or fault_level == 111 or fault_device LIKE "SBMU%" limit 10 offset 0;

# 类型加等级 告警
select * from alarm where (fault_level == 1 or fault_level == 111) and (fault_device not LIKE "SBMU%") limit 10 offset 0;

# 复归相关
select * from alarm where and recovery_time > "2001-01-01 00:00:00.000" and recovery_time < "2026-01-01 00:00:00.000"  limit 10 offset 0;
```

- 测试

```sql
select * from alarm;
select * from alarm limit 10 offset 0;
select * from alarm where fault_code == 111 limit 10 offset 0;

select * from alarm where (fault_level == 1 or fault_device LIKE "%TMS%") and fault_device == "SBMU1" limit 10 offset 0;

# 事件类型 基础写
select * from alarm where (fault_level == 1 or fault_device LIKE "TMS%") limit 10 offset 0;

select * from alarm where (fault_level == 1 or fault_device LIKE "SBMU%") and (fault_level == 111 or fault_device LIKE "SBMU%") limit 10 offset 0;

# 类型加等级 故障
select * from alarm where fault_level == 1 or fault_level == 111 or fault_device LIKE "SBMU%" limit 10 offset 0;

# 类型加等级 告警
select * from alarm where (fault_level == 1 or fault_level == 111) and (fault_device not LIKE "SBMU%") limit 10 offset 0;

select * from alarm where fault_device LIKE "%TMS%" limit 10 offset 0;

# 复归时间
select * from alarm where and recovery_time > "2001-01-01 00:00:00.000" and recovery_time < "2026-01-01 00:00:00.000"  limit 10 offset 0;

select * from alarm where (fault_level == 1 or fault_level == 111) and (fault_device not LIKE "SBMU%") and recovery_time > "2001-01-01 00:00:00.000" and recovery_time < "2026-01-01 00:00:00.000"  limit 10 offset 0;
```


## 通过`no`删除

```sql
delete from alarm where no == 674002;
```
