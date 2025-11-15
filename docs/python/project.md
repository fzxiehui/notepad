# 创建最小项目

## 初始化

- 创建目录

```shell
mkdir demo && cd demo
```

- 创建虚拟环境

```shell
python -m venv venv && echo "*" >> venv/.gitignore
```

- `.gitignore`

```shell
echo -e "__pycache__/\n*.py[cod]\n*.egg-info/\n.installed.cfg\n*.egg\nbin\ndist\nbuild\nvenv" >> .gitignore
```

- `pytest.ini`

```ini
echo -e "[pytest]\nlog_cli = true\nlog_cli_level = INFO" >> pytest.ini
```

- `requirements.txt`

```shell
touch requirements.txt
```

- `Makefile`

:::warning 提示
- 如果是复杂编译, 推荐写一个`python`脚本放在`scripts/make`目录中然后用`Makefile`运行
- 如果不用支持`windows`建议把`WINDOWS`相关内容删除
:::

```make
.PHONY: help test venv install install-windows build build-windows run 

default: help

VENV = venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
PYTEST = $(VENV)/bin/pytest

WINDOWSPYTHON = $(VENV)\Scripts\python.exe
WINDOWSPIP = $(VENV)\Scripts\pip.exe
WINDOWSPYINSTALLER = $(VENV)\Scripts\pyinstaller.exe

help:
	@echo "help"

venv:
	python -m venv $(VENV)
	echo "*" > $(VENV)/.gitignore

install:
	$(PIP) install -r requirements.txt

install-windows:
	$(WINDOWSPIP) install -r requirements.txt

build:
	-rm build/ -rf 
	-rm dist/ -rf
	$(PYTHON) setup.py sdist bdist_wheel

build-windows:
	-if exist build rmdir /s /q build
	-if exist dist rmdir /s /q dist
	$(WINDOWSPYTHON) setup.py sdist bdist_wheel

run:
	$(PYTHON) main.py

test:
	$(PIP) install -e .
	$(PYTEST) -s	
```

- `README.md` 

```shell
echo "# project name" > README.md
```

- `setup.py`

:::warning 警告
- 修改版本号, 项目名, 项目依赖, 作者, 邮箱
- 非包库项目,以下内容非必要
:::

```python{5-6,15-16,24}
import os 

from setuptools import setup, find_packages

name = "demo"
__version__ = "0.0.2"

scriptFolder = os.path.dirname(os.path.realpath(__file__))
os.chdir(scriptFolder)

setup(
        name=name,
        version=__version__,
        url="",
        author="fzxiehui",
        author_email="1059248139@qq.com",
        description="",
        long_description=open("README.md").read(),  # 从 README.md 中读取描述
        long_description_content_type="text/markdown",
        packages=find_packages(),
        test_suite="tests",
        include_package_data=True,
        install_requires=[
            "xxx==x.x",
            ],
        )
```

- `main.py`

```python
print('hello')
```


- 运行项目

```shell
make run
```
