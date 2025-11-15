# 形态学

## 类型

| 操作 | 表达式 | 效果说明 |
| :--: | :-----: | :------------------:
| 腐蚀 | Erosion | 减小前景，去除小噪点 |
| 膨胀 | Dilation | 扩大前景，填补空洞 |
| 开运算 | 先腐蚀 再膨胀 | 去除小白噪点（比目标小的白区域） |
| 闭运算 | 先膨胀 再腐蚀 | 填补小黑洞（比目标小的黑区域） |
| 梯度 | 梯度 = 膨胀 - 腐蚀结果 | 提取物体边缘（轮廓）, 边缘检测，替代 `cv2.Canny` 等方法 |
| 礼帽 | 礼帽 = 原始输入 - 开运算结果 | 提取比结构元素小的亮区域（如白点）提取亮点，例如光斑检测、字符提取 |
| 黑帽 | 黑帽 = 闭运算结果 - 原始输入 | 提取比结构元素小的暗区域（如黑洞）提取黑点，例如影子、污点、裂痕检测等 |

## 腐蚀与膨胀

- 效果

| 算法 | 原图 | 1-3次效果 |
| :--: | :--: | :-------- |
| 腐蚀 | ![img](/cv/morphology/img.jpeg) | ![erosion](/cv/morphology/erosion.jpeg) |
| 膨胀 | ![img](/cv/morphology/img.jpeg) | ![dilate](/cv/morphology/dilate.jpeg)  |

- 代码

```python
import cv2
import numpy as np

# 构造一张合成图像：圆形 + 噪声
img = np.zeros((300, 300, 3), dtype=np.uint8)
cv2.circle(img, (150, 150), 80, (255, 255, 0), -1)  # 圆形
noise = np.random.randint(0, 40, img.shape, dtype=np.uint8)
img = cv2.add(img, noise)

# 腐蚀
kernel = np.ones((10, 10), np.uint8)
erosion1 = cv2.erode(img, kernel, iterations=1)
erosion2 = cv2.erode(img, kernel, iterations=2)
erosion3 = cv2.erode(img, kernel, iterations=3)
erobin = np.hstack((erosion1, erosion2, erosion3))
# cv2.imwrite("erosion.jpeg", erobin)

# 膨胀
dilate1 = cv2.dilate(img, kernel=kernel, iterations=1)
dilate2 = cv2.dilate(img, kernel=kernel, iterations=2)
dilate3 = cv2.dilate(img, kernel=kernel, iterations=3)
dibin = np.hstack((dilate1, dilate2, dilate3))
# cv2.imwrite("dilate.jpeg", dibin)

bin = np.vstack((erobin, dibin))
show = cv2.resize(bin, (0, 0), fx=0.5, fy=0.5)
cv2.imshow("show", show)
cv2.waitKey(0)
```

## 开闭运算,梯度,礼帽,黑帽

- 效果

| 原图 | 开运算 | 闭运算 |
| :--: | :----: | :----: |
| ![img](/cv/morphology/img.jpeg) | ![opening](/cv/morphology/opening.jpeg) | ![closing](/cv/morphology/closing.jpeg) |
| 梯度 | 礼帽 | 黑帽 |
| ![img](/cv/morphology/gradient.jpeg) | ![opening](/cv/morphology/tophat.jpeg) | ![closing](/cv/morphology/blackhat.jpeg) |

- 代码

```python
import cv2
import numpy as np

# 构造一张合成图像：圆形 + 噪声
img = np.zeros((300, 300, 3), dtype=np.uint8)
cv2.circle(img, (150, 150), 80, (255, 255, 0), -1)  # 圆形
noise = np.random.randint(0, 40, img.shape, dtype=np.uint8)
img = cv2.add(img, noise)

# 开运算: 先腐蚀 再膨胀
kernel = np.ones((5, 5), np.uint8)
opening = cv2.morphologyEx(img, 
        cv2.MORPH_OPEN,  # 开运算
        kernel=kernel)

# 闭运算: 先膨胀 再腐蚀
closing = cv2.morphologyEx(img, 
        cv2.MORPH_CLOSE,  # 闭运算
        kernel=kernel)

# 原图， 开， 闭
open_clos_show = np.hstack((img, opening, closing))

# 梯度运算
# 梯度 = 膨胀 - 腐蚀
gradient = cv2.morphologyEx(img, cv2.MORPH_GRADIENT, kernel)

# 礼帽黑帽

# 礼帽 = 原始输入 - 开运算结果
tophat = cv2.morphologyEx(img, cv2.MORPH_TOPHAT, kernel)

# 黑帽 = 闭运算结果 - 原始输入
blackhat = cv2.morphologyEx(img, cv2.MORPH_BLACKHAT, kernel)


# 梯度， 礼帽， 黑帽
gtb_show = np.hstack((gradient, tophat, blackhat))

bin = np.vstack((open_clos_show, gtb_show))
show = cv2.resize(bin, (0, 0), fx=0.5, fy=0.5)


# 保存
# cv2.imwrite("opening.jpeg", opening)
# cv2.imwrite("closing.jpeg", closing)
# cv2.imwrite("gradient.jpeg", gradient)
# cv2.imwrite("tophat.jpeg", tophat)
# cv2.imwrite("blackhat.jpeg", blackhat)


cv2.imshow("show", show)
cv2.waitKey(0)
```
