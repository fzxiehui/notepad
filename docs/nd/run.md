# 运行分析

## docker

```shell
docker exec -it dataflow-v1.0 /bin/bash
docker exec -it tdengine  /bin/bash
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
