# 滤波

:::tip 滤波主要用于
- 去噪（平滑图像）
- 突出图像特征（如边缘、纹理）
- 模糊处理（如背景虚化）
:::

## 类型

| 滤波类型 | 函数 | 特点 |
| :-----: | :--- | :-------- |
| 均值滤波 | `blur` | 平滑图像，容易模糊边缘 |
| 方框滤波 | `boxFilter` | 类似均值滤波，但有归一化控制 |
| 高斯滤波 | `GaussianBlur` | 按高斯分布加权，更自然的模糊效果 |
| 中值滤波 | `medianBlur` | 保边缘的同时去噪，常用于椒盐噪声 |
| 双边滤波 | `bilateralFilter` | 保边缘模糊背景，类似美颜效果 |

## 示例

- 效果

| 原图 | 均值滤波 | 方框滤波 |
| :--: |  :--:  | :--: |
| ![img](/cv/filter/img.jpeg) | ![blur](/cv/filter/blur.jpeg)| ![box](/cv/filter/box.jpeg) |
| 高斯滤波 | 中值滤波 | 双边滤波 |
| ![img](/cv/filter/gaussian.jpeg) | ![blur](/cv/filter/median.jpeg)| ![box](/cv/filter/bilateral.jpeg) |

- 代码

```python
import cv2
import numpy as np

# 构造一张合成图像：圆形 + 噪声
img = np.zeros((300, 300, 3), dtype=np.uint8)
cv2.circle(img, (150, 150), 80, (255, 255, 0), -1)  # 圆形
noise = np.random.randint(0, 40, img.shape, dtype=np.uint8)
img = cv2.add(img, noise)

# 各种滤波
mean = cv2.blur(img, (5, 5))                                # 均值滤波
"""
img: 输入图像。
(5, 5): 滤波核的大小，表示一个 5×5 的窗口。
作用：对图像区域内的像素取平均值，模糊效果明显，但容易丢失边缘。
"""
box = cv2.boxFilter(img, -1, (5, 5), normalize=True)        # 方框滤波
"""
img: 输入图像。
-1: 输出图像的深度，-1 表示和输入图像深度一致。
(5, 5): 滤波核大小。
normalize=True: 是否归一化（True 表示除以核的面积，相当于均值滤波；False 则不除）。
与 blur() 类似，但可以控制是否归一化，灵活性更强。
"""
gaussian = cv2.GaussianBlur(img, (5, 5), 1.5)               # 高斯滤波
"""
(5, 5): 高斯核的大小，必须为奇数。
1.5: σ 值，标准差。控制模糊程度，值越大越模糊。
加权平均，靠近中心的像素权重更大，边缘保持得更好。
"""
median = cv2.medianBlur(img, 5)                             # 中值滤波
"""
5: 核大小，必须是奇数。
用局部窗口的中位数替换中心像素，对椒盐噪声去除非常有效。
"""
bilateral = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)  # 双边滤波
"""
d: 像素邻域的直径（影响滤波范围）。
sigmaColor: 颜色空间的 σ 值，颜色相近才会互相影响。
sigmaSpace: 空间距离的 σ 值，距离远的像素影响小。
能在保留边缘的同时去除噪声，适合美颜处理等需求，但计算较慢。
"""

# 统一尺寸，水平拼图
row1 = np.hstack((img, mean, box))        # 原图 + 均值 + 方框
row2 = np.hstack((gaussian, median, bilateral))  # 高斯 + 中值 + 双边

# 垂直拼接
result = np.vstack((row1, row2))

# 显示结果
cv2.imshow("All Filters Comparison", result)
cv2.waitKey(0)
cv2.destroyAllWindows()

# cv2.imwrite("img.jpeg", img=img)
# cv2.imwrite("blur.jpeg", img=mean)
# cv2.imwrite("box.jpeg", img=box)
# cv2.imwrite("gaussian.jpeg", img=gaussian)
# cv2.imwrite("median.jpeg", img=median)
# cv2.imwrite("bilateral.jpeg", img=bilateral)
```
