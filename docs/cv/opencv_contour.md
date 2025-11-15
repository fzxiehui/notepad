# 轮廓查找

:::tip 步骤
1. 读取图像并转灰度`gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)`(或提取单个图层)
1. 二值化处理图像（`threshold` 阈值分割）
1. 使用`cv2.findContours`提取轮廓
1. (可选)使用`cv2.drawContours` 绘制轮廓
1. (结果)计算选中轮廓的面积`cv2.contourArea`与周长`cv2.arcLength`
1. (可选)近拟操作`cv2.approxPolyDP`
:::

## `cv2.findContours`查找

```python
contours, hierarchy = cv2.findContours(image=thresh, 
                                       mode=cv2.RETR_CCOMP, 
                                       method=cv2.CHAIN_APPROX_SIMPLE)
```

- mode 参数

| 参数 | 含义 |
| :--- | :--- |
| `cv2.RETR_EXTERNAL` | 仅提取最外层轮廓 |
| `cv2.RETR_LIST` | 提取所有轮廓，不建立层级关系 |
| `cv2.RETR_CCOMP` | 所有轮廓，分为两级：外/内轮廓 |
| `cv2.RETR_TREE` | 所有轮廓，并建立完整层次结构 |

- method 参数: (逼近方法)

| 参数 | 含义 |
| :--- | :--- |
| `cv2.CHAIN_APPROX_NONE` | 保留所有点（不压缩） |
| `cv2.CHAIN_APPROX_SIMPLE` | 压缩水平/垂直/对角方向上的点集 |

## 示例

```python
import cv2
import numpy as np

# 构造一张合成图像：圆形 + 噪声
img = np.zeros((300, 300, 3), dtype=np.uint8)
cv2.circle(img, (150, 150), 80, (255, 255, 0), -1)  # 圆形
noise = np.random.randint(0, 40, img.shape, dtype=np.uint8)
img = cv2.add(img, noise)

# 转为灰度
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 做二值化处理
ret, thresh = cv2.threshold(gray, 120,255, cv2.THRESH_BINARY)
cv2.imshow("thresh", thresh)
cv2.waitKey(0)

# mode 检索模式
# 
# cv2.RETR_EXTERNAL - > 外轮廓
# cv2.RETR_LIST - > 所有轮廓到列表
# cv2.RETR_CCOMP -> 所有轮廓 -> 两层 外，内
# cv2.RETR_TREE -> 所有轮廓到树形
# 
# method: (逼近方法)
#
# cv2.CHAIN_APPROX_NONE	保留所有点（不压缩）
# cv2.CHAIN_APPROX_SIMPLE	压缩水平/垂直/对角方向上的点集
contours, hierarchy = cv2.findContours(image=thresh, 
        mode=cv2.RETR_CCOMP, 
        method=cv2.CHAIN_APPROX_NONE)

draw_img = img.copy()

# 绘制 -1 = 全部
res = cv2.drawContours(draw_img, contours, -1, (0, 0, 255), 5)
# res = cv2.drawContours(draw_img, contours, 0, (0, 0, 255), 5)

cv2.imshow("draw_img", draw_img)
cv2.waitKey(0)

cnt = contours[0]
print(cv2.contourArea(cnt))
print(cv2.arcLength(cnt, True))
```

## 近拟示例

- 效果

| 原图 | 输出 |
| :--: | :--: |
| ![img](/cv/contours/img.jpeg) | ![img](/cv/contours/output.jpeg) |

- 代码

```python
import cv2
import numpy as np

# 构造一张合成图像：圆形 + 噪声
img = np.zeros((300, 300, 3), dtype=np.uint8)
cv2.circle(img, (150, 150), 80, (255, 255, 0), -1)  # 圆形
noise = np.random.randint(0, 40, img.shape, dtype=np.uint8)
img = cv2.add(img, noise)

# 转灰度
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 二值化处理
_, thresh = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)

# 查找轮廓
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# 拷贝图像用于绘图
draw_img = img.copy()

for cnt in contours:
    # 跳过小轮廓
    area = cv2.contourArea(cnt)
    if area < 100:
        continue

    # 近似轮廓 —— ε:近似精度，越小越接近原始形状
    epsilon = 0.02 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)

    # 绘制近似多边形
    cv2.drawContours(draw_img, [approx], -1, (0, 0, 255), 2)

    # 绘制外接矩形
    x, y, w, h = cv2.boundingRect(cnt)
    cv2.rectangle(draw_img, (x, y), (x + w, y + h), (255, 0, 0), 2)

    # 绘制外接圆
    (cx, cy), radius = cv2.minEnclosingCircle(cnt)
    cv2.circle(draw_img, (int(cx), int(cy)), int(radius), (0, 255, 255), 2)

    # 轮廓顶点数判断几边形
    vertex_count = len(approx)
    text = f"{vertex_count} sides"
    cv2.putText(draw_img, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (180, 0, 255), 1)

# 显示结果
cv2.imshow("Contours with shapes", draw_img)
cv2.waitKey(0)
cv2.destroyAllWindows()
# cv2.imwrite("img.jpeg", img)
# cv2.imwrite("output.jpeg", draw_img)
```
