# python 环境

## python 版本管理

- 安装

    - 下载安装

        ```shell
        curl https://pyenv.run | bash
        ```

    - 追加配置`~/.bashrc`

        ```shell
        export PATH="$HOME/.pyenv/bin:$PATH"
        eval "$(pyenv init --path)"
        eval "$(pyenv virtualenv-init -)"
        ```

    - 当前`bash`生效配置`source ~/.bashrc`


- 使用

    ```shell
    pyenv install 3.9.0
    pyenv global 3.9.0
    python --version
    ```

## 虚拟环境

```shell
python -m venv venv
echo "*" > venv/.gitignore
source ./venv/bin/action
```
