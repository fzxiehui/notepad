# pillow与格式转换

## pillow
:::tip 目标
- 图像基础操作
- 转换成`bytes`使用网络进行传输
- 转换到`np`使用`opencv`操作
:::

### 安装

```shell
pip install pillow
```

### 创建图像

1. 打开图像

    ```python{3-4}
    from PIL import Image
    image_path = "./test.png"
    # 打开图像
    img = Image.open(image_path)
    img.show() # 使用系统图像查看工具进行显示
    ```

1. 截图

    ```python
    from PIL import ImageGrab
    img = ImageGrab.grab()
    img.show()
    img.show() # 使用系统图像查看工具进行显示
    ```

1. 绘制

    ```python
    from PIL import Image, ImageDraw

    # 创建一个正方形画布，比如 200x200
    size = 200
    image = Image.new('RGB', (size, size), color='white')

    # 创建绘图对象
    draw = ImageDraw.Draw(image)

    # 画方形边框（可选）
    draw.rectangle([0, 0, size - 1, size - 1], outline='black')

    # 画一个内切圆
    draw.ellipse([0, 0, size - 1, size - 1], fill='blue', outline='black')

    # 保存或显示图像
    image.show()
    # image.save('square_with_circle.png')
    ```

### 信息

```python
from PIL import Image

img = Image.open("./test.png")

print("format: ", img.format)
print("size", img.size)
print("mode", img.mode)
# > format:  PNG
# > size (736, 736)
# > mode RGBA

# 检查是否存在 Alpha 通道
if img.mode in ("RGBA", "LA"):  # 包含 Alpha 通道的模式
    img = img.convert("RGB")  # 转换为 RGB 模式
    rimg = img.convert("R")  # 只要红色通道
    limg = img.convert("L")  # 转灰度


"""
RGBA：带 Alpha 通道的彩色图像。
LA：带 Alpha 通道的灰度图像。
RGB：不带 Alpha 通道的彩色图像。
L：灰度图像。
"""
```

### 形态

```python
# 旋转 90度
img.rotate(45)
```

## 格式转换(重要)

1. 打开`bytes`并转为`np.ndarray`

    ```python
    def bytes_to_opencv(img_bytes: bytes):
        img_bytes = BytesIO(image_bytes)
        img = Image.open(img_bytes)
        # 判断是否有 Alpha 通道
        if "A" in img.getbands():
            img_np = np.array(img)
            return cv2.cvtColor(img_np, cv2.COLOR_RGBA2BGRA)
        else:
            img = img.convert("RGB")
            img_np = np.array(img)
            return cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
    ```

1. `PIL.Image`转`bytes`

    ```python
    def screenshot_png_bytes() -> bytes:
        """
        获取屏幕截图并以 PNG 格式编码为字节数据。
        :return: 以 PNG 格式编码的字节数据
        """
        img = ImageGrab.grab()
        img_bytes = BytesIO()
        img.save(img_bytes, format="PNG")  # PNG 无损，不影响图像质量
        return img_bytes.getvalue()

    def screenshot_jpeg_bytes(quality: int = 90) -> bytes:
        """
        获取屏幕截图并以 JPEG 格式编码为字节数据。
        :param quality: JPEG 质量（范围 0-100），默认 90。
        :return: 以 JPEG 格式编码的字节数据
        """
        img = ImageGrab.grab()
        img_bytes = BytesIO()
        img.save(img_bytes, format="JPEG", quality=quality)
        return img_bytes.getvalue()
    ```

