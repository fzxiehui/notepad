# 阈值操作

## `cv2.threshold()` 函数

:::tip

- **注意：输入图像必须为单通道灰度图！**
  - 可使用 `cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)` 转换
- 如果希望自动选取最佳阈值，可以使用 `cv2.THRESH_OTSU` 结合 `cv2.THRESH_BINARY` 等
:::

```python
retval, dst = cv2.threshold(src, thresh, maxval, type)
```

### 参数说明

| 参数        | 含义|
|-------------|-----------------------------------------------------|
| `src`       | 输入图像（需为**灰度图**）|
| `thresh`    | 阈值 |
| `maxval`    | 超过阈值时赋予的值（用于二值化）|
| `type`      | [阈值化类型（见下表）](#阈值类型)|
| 返回值 `ret` | 实际使用的阈值（与 `thresh` 相同，除非使用 `OTSU`） |


### 阈值类型

| 类型                     | 含义                                               |
|--------------------------|----------------------------------------------------|
| `cv2.THRESH_BINARY`      | 超过阈值 -> `maxval`，否则为 `0`                   |
| `cv2.THRESH_BINARY_INV`  | 与 `BINARY` 相反                                   |
| `cv2.THRESH_TRUNC`       | 超过阈值 -> 设为阈值，否则不变                     |
| `cv2.THRESH_TOZERO`      | 小于阈值 -> 设为 `0`，否则不变                     |
| `cv2.THRESH_TOZERO_INV`  | 与 `TOZERO` 相反                                   |

### 示例
- 效果

| 原图 | BINARY | BINARY_INV |
| :--: | :--: | :--: |
| 原始图像（灰度渐变） | Binary（大于127为255，其余为0） | Binary_INV（反向） |
| ![threshold](/cv/threshold/threshold_img.jpeg) | ![binary](/cv/threshold/threshold_binary.jpeg)  |![binary_inv](/cv/threshold/threshold_binary_inv.jpeg) |
| TRUNC | TOZERO | TOZERO_INV |
| Trunc（大于127截断为127） | ToZero（小于127为0，其余不变） | ToZero_INV（反向） |
| ![trunc](/cv/threshold/threshold_trunc.jpeg) | ![binary](/cv/threshold/threshold_tozero.jpeg)  |![binary_inv](/cv/threshold/threshold_tozero_inv.jpeg) |

- 代码

```python
import cv2
import numpy as np

# 生成 256×256 的灰度图：横向灰度渐变
img = np.tile(np.arange(0, 256, dtype=np.uint8), (256, 1))

# 阈值处理
_, binary = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
_, binary_inv = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV)
_, trunc = cv2.threshold(img, 127, 255, cv2.THRESH_TRUNC)
_, tozero = cv2.threshold(img, 127, 255, cv2.THRESH_TOZERO)
_, tozero_inv = cv2.threshold(img, 127, 255, cv2.THRESH_TOZERO_INV)

cv2.imshow("IMG", img)
cv2.imshow("BINARY", binary)
cv2.imshow("BINARY_INV", binary_inv)
cv2.imshow("TRUNC", trunc)
cv2.imshow("TOZERO", tozero)
cv2.imshow("TOZERO_INV", tozero_inv)

cv2.waitKey(0)
cv2.destroyAllWindows()

# # 横向拼接图像
# row1 = np.hstack((img, binary, binary_inv))
# row2 = np.hstack((trunc, tozero, tozero_inv))
# 
# # 纵向拼接为最终展示图
# output = np.vstack((row1, row2))
# 
# # 显示
# cv2.imshow("Thresholding Demo (256x256)", output)
# cv2.waitKey(0)
# cv2.destroyAllWindows()
```

