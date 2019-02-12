# markdown-pic2github README
![](https://img.shields.io/github/license/Quareia/vscode-markdown-pic2github.svg)

1个vscode插件，提供markdown的github图片外链。编写markdown文件时可以上传本地图片并拷贝到本地git仓库，最后自动提交到github

### Usage
- settings.json中修改对应的属性
    1. `local_git_folder`：本地存储图片的git仓库文件夹名，为绝对路径
    2. `remote_github_repo`：github对应的图片仓库
- `ctrl+alt+g`：选择上传图片

### 插件改造内容 V1
- `settings.json` 中增加了一个属性
  - `images_folder`: 图片的文件夹名称
-  改造为适用于 windows 环境
-  对 url 进行编码
-  可将图片上传到 `local_git_folder/{images_folder}/文件名称/图片.png|jpg...`, 
比如 `local_git_folder` 配置为 `E:/git/github/blog`(此目录为 git 的根目录, 且有一个 `images` 子目录专门用于存放图片) , `remote_github_repo` 配置为 `tom/blog`, `images_folder` 配置为 `images`, 有一个名为 `hello.md` 的文件, 上传了一张 `world.png` 的图片, 那么最终图片被拷贝到本地的 `E:/git/github/blog/images/hello/world.png`, 上传到 github 仓库后的路径为 `https://www.github.com/tom/blog/raw/master/images/hello/world.png`.`hello.md` 中插入的图片地址为 `![world](https://www.github.com/tom/blog/raw/master/images/hello/world.png)`.

这样做的目的是方便归类和整理图片.

### 插件改造内容 V2
在 V1 版本的基础之上对图片的目录归类做了更细致的整理.
比如 `local_git_folder` 配置为 `E:/git/github/blog`, `remote_github_repo` 配置为 `tom/blog`, `images_folder` 配置为 `images`, 在另外一个仓库 `E:/git/github/blog-article`, 在 `web/css` 目录下有一个名为 `hello.md` 的文件, 上传了一张 `world.png` 的图片, 那么最终图片被拷贝到本地的 `E:/git/github/blog/images/web/css/hello/world.png`, 上传到 github 仓库后的路径为 `https://www.github.com/tom/blog/raw/master/images/web/css/hello/world.png`.

这样图片的存放位置和文章的存放目录可以保持一致.
