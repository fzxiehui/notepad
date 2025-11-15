# 2025年11月

## python 下载pdf

```shell
# 系统依赖
sudo apt install wkhtmltopdf

# python 库 -> pdfkit==1.0.0
pip install pdfkit
```

```python
import pdfkit

# From a URL
pdfkit.from_url('http://127.0.0.1:8801/cv/opencv_morphology.html', 'output.pdf')

# From an HTML file
# pdfkit.from_file('input.html', 'output.pdf')
# 
# # From an HTML string
# html_string = "<h1>Hello, World!</h1><p>This is a test.</p>"
# pdfkit.from_string(html_string, 'output.pdf')
```

## 虚拟机错误

> `VirtualBox can't operate in VMX root mode. Please disable the KVM kernel extension, recompile your kernel and reboot (VERR_VMX_IN_VMX_ROOT_MODE).`

- 临时方法

```shell
# 如果你使用的是 AMD CPU，请把 kvm_intel 改为 kvm_amd。
sudo rmmod kvm_intel
sudo rmmod kvm
```

- 长期法

```shell
# 如果你使用的是 AMD CPU，请把 kvm_intel 改为 kvm_amd。
echo "blacklist kvm_intel" | sudo tee /etc/modprobe.d/blacklist-kvm.conf
echo "blacklist kvm" | sudo tee -a /etc/modprobe.d/blacklist-kvm.conf
```
