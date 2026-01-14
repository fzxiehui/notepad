# 运行分析

## docker

```shell
docker exec -it dataflow-v1.0 /bin/bash
docker exec -it tdengine  /bin/bash
```

## 日志

```shell
cd /opt/dataflow_lite/task_logs
ls -lrt
```

## 查询测试

```sql
2025-11-07T00:00:00+08:00
select ts, BAT_U_HVS, tag1 from S2A_SUMDATA1; where ts > '2025-12-13T00:00:00+08:00' and ts < '2025-12-15T00:00:00+08:00';
select ts, S2A_BAT_I_HVS, tag1 from S2A_SUMDATA11 where ts>'2025-12-13 00:00:00' and ts<'2025-12-14 00:00:00';
select ts, BAT_T_Avg, tag1 from S2A_SUMDATA2_4 where ts>'2025-12-13 00:00:00' and ts<'2025-12-14 00:00:00';

SELECT *
FROM S2A_SUMDATA1
WHERE ts >= '2025-12-15 00:00:00'
  AND ts <  '2025-12-16 00:00:00';

select * from S2A_SUMDATA1 where ts > '2025-12-15 00:00:00' and ts < '2025-12-16 00:00:00';


select ts, BAT_SOC_HVS, tag1 from S2A_SUMDATA5_12 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, M2P_M2PMaxVolt, M2P_M2PMinVolt from M2P_SUMDATA4_5 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, M2P_RSOC, M2P_DSOC from M2P_SUMDATA1_2 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, M2P_M2PMaxVolt_B, tag1 from M2P_SUMDATA17 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, M2P_SOC_B, M2P_M2PMinVolt_B, tag1 from M2P_SUMDATA18 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, S2A_BAT_I_HVS, tag1 from S2A_SUMDATA11 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, BAT_Lmt_ChCurrent, BAT_Lmt_DisChCurrent, tag1 from S2A_SUMDATA16 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, BAT_T_Avg, tag1 from S2A_SUMDATA2_4 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, M2P_Evn_T1, M2P_Evn_T2, M2P_Evn_T3, 1 M2P_Evn_T4 from M2P_SUMDATA3 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
select ts, BAT_U_HVS, tag1 from S2A_SUMDATA1 where ts>'2025-12-16 00:00:00' and ts<'2025-12-17 00:00:00';
```

## 建表

- `soc`一致性分析

```sql
CREATE STABLE SOCConsistency (ts TIMESTAMP, max_dsoc_diff FLOAT, max_rsoc_diff FLOAT, max_sbmu_rsoc FLOAT, min_sbmu_rsoc FLOAT, max_soc_pos TINYINT, min_soc_pos TINYINT, max_busbar_single_cell_vol SMALLINT UNSIGNED, min_busbar_single_cell_vol SMALLINT UNSIGNED, max_sys_cell_vol SMALLINT UNSIGNED, min_sys_cell_vol SMALLINT UNSIGNED) TAGS (tag1 TINYINT, tag2 TINYINT);
```

- 簇间电流一致性分析

```sql
CREATE STABLE cluster_current_consistency (ts TIMESTAMP, max_charge_current_diff_a FLOAT, max_discharge_current_diff_a FLOAT, max_charge_current_std_a FLOAT, max_discharge_current_std_a FLOAT, charge_inconsistency_max_pos TINYINT, charge_inconsistency_min_pos TINYINT, charge_current_diff_max_time TIMESTAMP, charge_inconsistency_max_pos_real_soc FLOAT, charge_inconsistency_min_pos_real_soc FLOAT, charge_inconsistency_max_pos_avg_cell_temp SMALLINT, charge_inconsistency_min_pos_avg_cell_temp SMALLINT, charge_inconsistency_max_pos_current FLOAT, charge_inconsistency_min_pos_current FLOAT, charge_inconsistency_max_pos_allowed_current FLOAT, charge_inconsistency_min_pos_allowed_current FLOAT, charge_inconsistency_max_diff_time_env_temp SMALLINT, discharge_inconsistency_max_pos TINYINT, discharge_inconsistency_min_pos TINYINT, discharge_current_diff_max_time TIMESTAMP, discharge_inconsistency_max_pos_real_soc FLOAT,  discharge_inconsistency_min_pos_real_soc FLOAT, discharge_inconsistency_max_pos_avg_cell_temp SMALLINT, discharge_inconsistency_min_pos_avg_cell_temp SMALLINT, discharge_inconsistency_max_pos_current FLOAT, discharge_inconsistency_min_pos_current FLOAT, discharge_inconsistency_max_pos_allowed_current FLOAT, discharge_inconsistency_min_pos_allowed_current FLOAT, discharge_inconsistency_max_diff_time_env_temp SMALLINT, flat_region_avg_dcr FLOAT, charge_end_dcr FLOAT, discharge_end_dcr FLOAT) TAGS (tag1 TINYINT, tag2 TINYINT);
```
