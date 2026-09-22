# 关于Git的基础使用及与GitHub相连的使用解说

  

## 一、常用的Linux命令  

1. 改变目录：`cd`  （注：如果目录名中存在空格，则目录名需要加上引号）  
2. 回退到上一个目录：``cd ..  ``
3. 显示当前目录：``pwd  ``
4. 清屏：`clear`  
5. 列出文件：``ls  ``
6. 新建文件：``touch  ``
7. 删除文件：``rm `` 
8. 新建文件夹：`mkdir`  
9. 删除文件夹：`rm -r`  
10. 移动文件：``mv A B``  (注：AB是你选定的文件)
11. 查看历史命令：``history  ``
12. 退出：``exit  ``

********

## 二、Git的必要配置 

### 1.查看配置信息

*   查看系统变量：``git config --systeam --list `` 
*   查看全局变量：``git config --global --list  ``
* 查看所有变量：``git config -l   ``

### 2.配置用户名和邮箱：  

* 配置用户名：``git config --global user.name  ``
* 配置邮箱：`git config --global user.email`

****

## 三、Git项目创建与克隆（两种不同方法）

### 1.本地仓库搭建：

* D盘新建一个文件夹  
* 进入文件夹后右键打开  `Git Bash `
* 输入`git init`。当看到文件夹里多出了一个`.git`格式的文件夹即可  

## 2.克隆远程仓库（以GitHub为例）：

* 找到需要复制的网址   
  * 点击主页面的`code`选项  
  * 复制ssh网址
* 复刻上述搭建步骤
* 输入`git clone "你复制的网址"`。当文件夹里出现了你所复制的所有文件即可

****

## 四、Git的基本操作命令

### 1.查看文件状态（常用）：

* 查看所有文件状态：`git status`
* 查看指定文件状态：`git status [文件名]`
* 添加文件到暂存区：`git add .`
* 添加文件到本地仓库：`git commit -m "描述这项任务的内容"`
* 上传文件到远程仓库：`git push -u origin main`(前提见：六、ssh配置)

****

## 五、Git的基本理论（核心）

### 1.四个区域：

* workspace（工作区：在此完成被分配或者需要完成的代码修改任务）  
* Index/Stage（暂存区：使用``git add .``可以保存到此区域）  
* Repository（仓库区：使用`git commit  -m "描述这项任务的内容"`）  
* Remote（远程仓库：github等；此项目 第一次推送：`git push -u origin main;此后：`git push origin main)

### 2.工作流程图：![](D:\git的初版\微信图片_20260922163837_469_2.jpg)

****

## 六、ssh配置和连接git与github

### 1.ssh的获取

* 打开Git Bash 输入`ssh-keygen -t rsa`
* 持续回车直至再次显示初始状态
* 打开 C盘-用户-`.ssh`文件夹，找到里面以`.pub`结尾的文件，打开并复制里面的所有密钥即可

### 2.ssh的配置

* 点击GitHub右上角的`setting（设置）`
* 点击左半边的`ssh and gpgkeys`
* 将复制的密钥输入进去即可

### 3.连接git与github

* 打开github里的其中一个仓库，复制此仓库的ssh网址（不要http）
* 在git上输入`git remote add origin 网站`即可
* 检测是否成功：输入`ssh -T 网站`出现`successfully`即可

****

## 七、流程总结（从无到成功上传）

* D盘新建文件夹右键打开Git Bash
* 配置用户名和邮箱（只有第一次需要）
* 获取ssh密钥
* 配置ssh密钥
* 初始化本地仓库：输入`git init`
* 连接git与github
* 开始完成任务，新增了很多文件
* 将文件上传到暂存区
* 将文件上传到本地仓库
* 将文件上传到github