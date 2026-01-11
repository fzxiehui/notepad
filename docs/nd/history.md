```sql
SELECT
   first(Cell104) AS Cell104 , _wstart AS _ts
FROM S2P_Detail_Tcell1
WHERE
   ts > '2025-12-01 06:35:00' AND ts < '2025-12-01 06:45:00'
   AND tag1 = 1
   AND tag2 = 4
INTERVAL(10s)
ORDER BY _ts DESC
LIMIT 60;




SELECT
   first(M2P_M2PMaxVolt) AS M2P_M2PMaxVolt , first(M2P_M2PMinVolt) AS M2P_M2PMinVolt , first(M2P_M2PAvgVolt) AS M2P_M2PAvgVolt , _wstart AS _ts
FROM M2P_SUMDATA4_5
WHERE
   ts > '2025-12-01 06:35:00.000' AND ts < '2025-12-01 06:36:00.000'
   AND tag1 = 0
   AND tag2 = 0
INTERVAL(200a)
ORDER BY _ts  DESC
LIMIT 300;
```
