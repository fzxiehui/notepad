# 主页功能调试

### 开启行缓存

```shell
alter database bms_db cachemodel 'last_row';
```

### 系统状态

```sql
# 删除表
drop table m2p_sumdata1_2;
select last_row(m2p_sysrunstate, m2p_current) from m2p_sumdata1_2;

select last_row(m2p_m2prunstate, m2p_current) from m2p_sumdata1_2;
```

### 系统SOX

```sql
select * from m2p_sumdata15_19;
select (m2p_soc, m2p_soh) from m2p_sumdata15_19;
select (m2p_soh) from m2p_sumdata15_19;

select last_row(m2p_soc, m2p_soh) from m2p_sumdata15_19;

# 最终
select last_row(m2p_dsoc, m2p_soh, m2p_measure_vol) from m2p_sumdata1_2 where tag1=0 and tag2=0;
```

### 系统电流

```sql
select last_row(m2p_current) from m2p_sumdata1_2 where tag1=0 and tag2=0;
select last_row(m2p_permitmaxcharge_i, m2p_permitmaxdischarge_i) from m2p_sumdata3 where tag1=0 and tag2=0;
```

### 系统功率

```sql
select last_row(m2p_power, m2p_permitmaxpower_charge) from m2p_sumdata6_7 where tag1=0 and tag2=0;
select last_row(m2p_permitmaxdischarge_i) from m2p_sumdata3 where tag1=0 and tag2=0;
```

### 数据库测试(最近24小时系统soc)

```sql
SELECT
    FIRST(ts) AS ts,
    AVG(bat_user_soc_hvs) AS bat_user_soc_hvs_avg
FROM s2a_sumdata5_12
WHERE ts BETWEEN NOW - 24h AND NOW
INTERVAL(1h)
FILL(LINEAR);
```

### 最近24小时温度最小与最大

- 正式

```sql
SELECT
    FIRST(ts) AS ts,
    MIN(m2p_m2pmintemp) AS m2p_m2pmintemp,
    MAX(m2p_m2pmaxtemp) AS m2p_m2pmaxtemp
FROM m2p_sumdata4_5
WHERE ts BETWEEN NOW - 24h AND NOW
INTERVAL(1h)
FILL(LINEAR);
```

- 测试 

```sql
SELECT
    FIRST(ts) AS ts,
    MIN(m2p_m2pmintemp) AS m2p_m2pmintemp,
    MAX(m2p_m2pmaxtemp) AS m2p_m2pmaxtemp
FROM m2p_sumdata4_5
WHERE ts BETWEEN "2025-11-07T00:00:00+08:00" AND "2025-11-08T00:00:00+08:00"
INTERVAL(1h)
FILL(LINEAR);
```

### 最近24小时系统电压

- 正式

```sql
SELECT
    FIRST(ts) AS ts,
    AVG(m2p_measure_vol) AS m2p_measure_vol_b
FROM m2p_sumdata1_2
WHERE ts BETWEEN NOW - 24h AND NOW
INTERVAL(1h)
FILL(LINEAR);
```

- 测试 

```sql
SELECT
    FIRST(ts) AS ts,
    AVG(m2p_measure_vol) AS m2p_measure_vol_b
FROM m2p_sumdata1_2
WHERE ts BETWEEN "2025-11-07T00:00:00+08:00" AND "2025-11-08T00:00:00+08:00"
INTERVAL(1h)
FILL(LINEAR);
```


### 最近24小时系统功率 电流

- 正式

```sql
SELECT
    FIRST(ts) AS ts,
    AVG(m2p_current) AS m2p_current
FROM m2p_sumdata1_2
WHERE ts BETWEEN NOW - 24h AND NOW
INTERVAL(1h)
FILL(LINEAR);
```

- 测试 

```sql
SELECT
    FIRST(ts) AS ts,
    AVG(m2p_current) AS m2p_current
FROM m2p_sumdata1_2
WHERE ts BETWEEN "2025-11-07T00:00:00+08:00" AND "2025-11-08T00:00:00+08:00"
INTERVAL(1h)
FILL(LINEAR);
```

### 最近24小时系统功率 w

- 正式

```sql
SELECT
    FIRST(ts) AS ts,
    AVG(bat_pwr) AS bat_pwr
FROM s2a_sumdata11
WHERE ts BETWEEN NOW - 24h AND NOW
INTERVAL(1h)
FILL(LINEAR);
```

- 测试 

```sql
SELECT
    FIRST(ts) AS ts,
    AVG(bat_pwr) AS bat_pwr
FROM s2a_sumdata11
WHERE ts BETWEEN "2025-11-07T00:00:00+08:00" AND "2025-11-08T00:00:00+08:00"
INTERVAL(1h)
FILL(LINEAR);
```

### 告警数量限制

- 查100条时间

```sql
SELECT fault_time 
FROM alarm 
ORDER BY fault_time DESC 
LIMIT 1 OFFSET 10000;
```

- 删除100条以前的数据

```sql
DELETE FROM alarm 
WHERE fault_time < '2035-10-17 04:50:20.139';
```

### 累计充放电

- 正式

    > 表`s2a_sumdata5_12` 字段 `s2a_his_charge_engery` and `s2a_his_discharge_engery`

```sql
# 12个sbmu累计放电
SELECT SUM(last_val) AS total_last_val
FROM (
    SELECT tag1, last_row(s2a_his_discharge_engery) AS last_val
    FROM s2a_sumdata5_12
    WHERE tag1 BETWEEN 1 AND 12
      AND tag2 = 0
    GROUP BY tag1
) AS tmp;

# 12个sbmu累计充电
SELECT SUM(last_val) AS total_last_val
FROM (
    SELECT tag1, last_row(s2a_his_charge_engery) AS last_val
    FROM s2a_sumdata5_12
    WHERE tag1 BETWEEN 1 AND 12
      AND tag2 = 0
    GROUP BY tag1
) AS tmp;

# 12个sbmu 当天0点累计放电
SELECT SUM(last_val) AS total_last_val
from (
    SELECT tag1, first(s2a_his_discharge_engery) as last_val
    FROM s2a_sumdata5_12
    WHERE tag1 BETWEEN 1 AND 12
      AND tag2 = 0
      AND ts >= today()
    GROUP BY tag1
) AS tmp;

# 12个sbmu 当天0点累计充电
SELECT SUM(last_val) AS total_last_val
from (
    SELECT tag1, first(s2a_his_charge_engery) as last_val
    FROM s2a_sumdata5_12
    WHERE tag1 BETWEEN 1 AND 12
      AND tag2 = 0
      AND ts >= today()
    GROUP BY tag1
) AS tmp;
```

- 测试过程

```sql
select last_row(s2a_his_discharge_engery) from s2a_sumdata5_12 where tag1=1 and tag2=0;
select last_row(s2a_his_discharge_engery) from s2a_sumdata5_12 where tag1 between 1 and 12 and tag2 = 0;
select s2a_his_discharge_engery from s2a_sumdata5_12 where tag1 between 1 and 12 and tag2 = 0;

# 每个tag 平均值
SELECT tag1, avg(s2a_his_discharge_engery)
FROM s2a_sumdata5_12
WHERE tag1 BETWEEN 1 AND 12
  AND tag2 = 0
GROUP BY tag1;

# 每个tag最新值
SELECT tag1, last_row(s2a_his_discharge_engery)
FROM s2a_sumdata5_12
WHERE tag1 BETWEEN 1 AND 12
  AND tag2 = 0
GROUP BY tag1;

# 每个tag合并
SELECT SUM(last_val) AS total_last_val
FROM (
    SELECT tag1, last_row(s2a_his_discharge_engery) AS last_val
    FROM s2a_sumdata5_12
    WHERE tag1 BETWEEN 1 AND 12
      AND tag2 = 0
    GROUP BY tag1
) AS tmp;

# 当天0点值

SELECT tag1, first(s2a_his_discharge_engery)
FROM s2a_sumdata5_12
WHERE tag1 BETWEEN 1 AND 12
  AND tag2 = 0
  AND ts >= today()
GROUP BY tag1;

```
