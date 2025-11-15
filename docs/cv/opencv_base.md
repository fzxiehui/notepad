# opencv基础

:::tip 提示
> `opencv`玩得好,顿顿都管饱.
:::


## 打开图像文件

```python
import cv2
import os

# 将工作目录设置为当前脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 读取图像（默认以彩色方式）
img = cv2.imread("../test.png")
print(img.shape)
```

---

## 图像信息（shape）

```python
print(img.shape)  # 输出示例: (736, 736, 3)
```

- `img.shape` 返回一个元组 `(height, width, channels)`
  
| 维度       | 含义            | 示例值  |
|------------|-----------------|---------|
| `height`   | 图像高度（行数）| 736     |
| `width`    | 图像宽度（列数）| 736     |
| `channels` | 通道数          | [通道类型说明](#通道类型说明)  |

## 通道类型说明

:::tip 提示
- OpenCV 默认使用 `BGR` 顺序，而不是 `RGB`。
- 可以用 `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)` 转换
:::

| 通道数 | 图像模式 | 加载方式 | 说明 |
| :----: |:--------| :--- |:-----|
| 无 | 灰度图 | `cv2.IMREAD_GRAYSCALE` | 也可能是单通道图像`len(img.shape) == 2`|
| `3` | 彩色图（BGR） | `cv2.IMREAD_COLOR`（默认）| OpenCV 默认按`BGR`顺序加载彩色图 |
| `4` | 彩色图（BGRA）| `cv2.IMREAD_UNCHANGED` | 包含透明度通道的图像，如 `PNG` 的 `alpha` 通道 |


## 图像转换说明
:::tip 常见图像转换 
OpenCV 提供了多种图像格式转换方法，常用于图像处理的预处理阶段。 
:::

### 彩色图像转灰度图

```python
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# 将 3 通道彩色图像转换为单通道灰度图。
# 转换后图像形状为 (height, width)，没有 channels 维度。
```

### BGR转RGB

```python
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
# 用于在 OpenCV（BGR）和 Matplotlib（RGB）之间兼容显示。
```

### 添加透明通道

```python
bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
# 在原图基础上添加一个 Alpha 通道。
```


## 调试窗口使用

:::tip 关键
- 创建窗口`cv2.namedWindow`
- 创建滑动条`cv2.createTrackbar`
- 获取滑动条的值`cv2.getTrackbarPos`
:::

```python
import cv2
import numpy as np

def nothing(x):
    pass

# 创建一个窗口
cv2.namedWindow("Trackbars")

# 创建滑动条
cv2.createTrackbar("Brightness", "Trackbars", 0, 100, nothing)

# 构造一张合成图像：圆形 + 噪声
img = np.zeros((300, 300, 3), dtype=np.uint8)
cv2.circle(img, (150, 150), 80, (255, 255, 0), -1)  # 圆形
noise = np.random.randint(0, 40, img.shape, dtype=np.uint8)
img = cv2.add(img, noise)

while True:
    # 获取滑动条的值
    brightness = cv2.getTrackbarPos("Brightness", "Trackbars")
    
    # 调整亮度
    adjusted_image = cv2.convertScaleAbs(img, alpha=1, beta=brightness)

    # 显示处理后的图像
    cv2.imshow("Trackbars", adjusted_image)

    # 按ESC退出
    if cv2.waitKey(1) & 0xFF == 27:
        break

cv2.destroyAllWindows()
```
