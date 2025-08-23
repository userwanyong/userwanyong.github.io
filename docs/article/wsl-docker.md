# Win11 安装 Wsl 与 Docker
<img src="https://img.shields.io/badge/-Docker-2496ED?logo=Docker&logoColor=FFF" alt="Docker" style="display: inline-block;margin-right: 2px" /> 
<img src="https://img.shields.io/badge/-Wsl-8A2BE2" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-Ubuntu-E95420?logo=Ubuntu&logoColor=FFF" alt="Ubuntu" style="display: inline-block;margin-right: 2px" /> 


## 1. 安装 wsl
<Linkcard url="https://learn.microsoft.com/zh-cn/windows/wsl/install" title="相关文档" description="https://learn.microsoft.com" logo="https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231213971.png"></Linkcard>

### 1.1. 环境准备
**step1**：本机搜索可选功能

![](https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231229452.png)

**step2**：下划找到更多windows功能

![](https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231231081.png)

**step3**：勾选以下功能

![](https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231231618.png)

**step4**：重启电脑

### 1.2. 执行安装
**step1**：win+r 输入 cmd 打开命令行

**step2**：输入`wsl -install`安装（使用此命令默认是wsl2）

![](https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231234334.png)

**step3**：耐心等待安装完，成功后如下图所示

![](https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231234022.png)

### 1.3. 拓展
默认wsl会安装在c盘，非常占空间，可以将wsl的安装目录修改到其他盘
::: code-group
```bash
# 1.查看发行版名称
wsl --list --verbose
# 2.导出现有的WSL发行版到D盘下的backup文件夹
mkdir D:\backup
wsl --export Ubuntu D:\backup\ubuntu.tar
# 3.导入发行版
mkdir D:\wsl
wsl --import Ubuntu_New D:\wsl\Ubuntu_New D:\backup\ubuntu.tar
# 为确保成功导入，再次查看发行版
wsl --list --verbose
# 尝试启动新导入的WSL发行版
wsl -d Ubuntu_New
# 4.卸载旧的WSL发行版，释放空间（可选）
wsl --unregister Ubuntu
# 5.直接删除backup文件夹（可选）
```
:::

## 2. 安装 docker desktop
<Linkcard url="https://docs.docker.com/desktop/features/wsl/" title="相关文档" description="https://docs.docker.com" logo="https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231213971.png"></Linkcard>


**step1**：下载安装包

![](https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231240367.png)

**step2**：双击安装包执行安装（一直默认就行）

**step3**：安装完成后双击桌面的图标启动

![](https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231244137.png)

这里会提示你登录，如果没有账号 sign up 注册即可，登录后页面如下

![](https://blog-1375280847.cos.ap-beijing.myqcloud.com/images/202508231245322.png)

至此，你就可以愉快的在 win 系统上使用 docker 了
