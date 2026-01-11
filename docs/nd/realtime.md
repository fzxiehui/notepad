# 实时数据测试

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
```

## cpu 压力测试

```shell
yes > /dev/null
```


## 打开行缓存

```sql
alter database bms_db cachemodel 'last_row';
```


## 实时数据

- 历史充放电信息

```sql
select * from m2p_pcsinfo order by ts desc limit 1;

select last_row(*) from m2p_pcsinfo where tag1=0 and tag2=0;
```


- 电芯电压累加

```sql
select last_row(*) from s2a_sumdata1 where tag1=1 and tag2=0;

```

- sbmu 最高最低单体电压

```sql
select last_row(bat_ucell_max, bat_ucell_min) from s2a_sumdata2_4 where tag1=1 and tag2=0;
```


- 汇流排高压状态

```sql
select last_row(m2p_bus1_hvstate1, m2p_bus1_hvstate2) from m2p_sumdata6_7 where tag1=0 and tag2=0;

# 能量
select last_row(m2p_bms_status) from m2p_sumdata15_19_b2 where tag1=1 and tag2=0;
```
