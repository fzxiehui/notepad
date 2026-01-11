# 系统控制


## 获取全部sbmu上下高压状态

- 正式使用

```sql
-- 列表
SELECT LAST_ROW(st_pwrstatus) 
FROM s2a_sumdata2_4 
WHERE tag2 = 0 AND tag1 IN (1, 2, 3, 4)
GROUP BY tag1;

-- 范围
SELECT LAST_ROW(st_pwrstatus) as data
FROM s2a_sumdata2_4 
WHERE tag2 = 0 
  AND tag1 BETWEEN 1 AND 13
GROUP BY tag1;

-- 带tag1
SELECT 
  tag1, 
  LAST_ROW(st_pwrstatus) 
FROM s2a_sumdata2_4 
WHERE tag2 = 0 
  AND tag1 BETWEEN 1 AND 12
GROUP BY tag1;
```

- 测试过程

```sql
select last_row(st_pwrstatus) AS `1` from s2a_sumdata2_4 where tag1 = 1 and tag2 = 0;
select last_row(st_pwrstatus) AS `2` from s2a_sumdata2_4 where tag1 = 2 and tag2 = 0;
select last_row(st_pwrstatus) AS `3` from s2a_sumdata2_4 where tag1 = 3 and tag2 = 0;
select last_row(st_pwrstatus) AS `4` from s2a_sumdata2_4 where tag1 = 4 and tag2 = 0;
```

## 获取全部汇流排上下高压状态

```sql
select last_row(*) from m2p_sumdata6_7;
```
