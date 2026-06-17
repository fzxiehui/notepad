# 运行分析

## docker

```shell
docker exec -it dataflow-v1.0 bash
```


## 日志

```shell
ls -hl task_logs/
tail -f task_logs/xxx.out
```


## 手动触发

```python
import requests
hp_host = "http://127.0.0.1:7001"


def test_dataflow(process_id):
    url = f"/api/v2/process/{process_id}/execute"
    body = {
        "paramList": [{"name": "today", "value": "2026-5-28 09:01:00"}],
        "partition": [{"name": "device_id", "value": [1]}]
    }
    resp = requests.post(hp_host+url, json=body)
    print(resp.json())
    

test_dataflow("20000000001106")
```
