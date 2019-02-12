// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode')
const path = require('path')
var exec = require('child_process').exec
const encoding = 'cp936'
const binaryEncoding = 'binary'
var iconv = require('iconv-lite');

const error = err => {
    vscode.window.showErrorMessage(err)
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.mdpic2github', function () {
        
        let editor = vscode.window.activeTextEditor
        
        // No open  file
        if (!editor) {
            vscode.window.showInformationMessage('No open file.')
            return
        }
        // Must be markdown file
        let doc = editor.document
        if (!(doc.languageId === "markdown")) {
            vscode.window.showInformationMessage('Must be a markdown file.')
            return
        }
        let localFolder = vscode.workspace.getConfiguration('pic2github').get('local_git_folder')
        let remoteRepo = vscode.workspace.getConfiguration('pic2github').get('remote_github_repo')
        let imagesFolder = vscode.workspace.getConfiguration('pic2github').get('images_folder')
        if (localFolder == "" || remoteRepo == "" || imagesFolder == "") {
            vscode.window.showInformationMessage('Please fill the configuration first.')
            return
        }

        var filename = doc.fileName.split(path.sep).pop()
        // 最终的文件名(不带扩展后缀)
        filename = filename.substring(0, filename.length - ".md".length);

        // 获取文件相对于 git 根目录的路径
        let relativeGitRootPath = vscode.workspace.asRelativePath(doc.fileName, false);
        // 去除文件的后缀
        let relativeGitRootPathWithoutExt = relativeGitRootPath.substr(0, relativeGitRootPath.length - ".md".length);

        vscode.window.showOpenDialog({
            filters: { 'Images': ['png', 'jpg', 'gif', 'bmp'] }
        }).then(result => {
            if (result) {
                // 解构
                let {fsPath} = result[0]
                let imgName = fsPath.split(path.sep).pop()

                var folderRoot = ''
                var idx = localFolder.indexOf(':')
                if (idx == 1) {
                    folderRoot = localFolder.substr(0, idx + 1);
                }

                // 图片要复制的指定图片目录的相对路径
                let imagesPath = localFolder + path.sep + imagesFolder;
                // 图片要复制的目标相对路径
                let fileNamedFolder = imagesPath + path.sep + relativeGitRootPathWithoutExt
                // 相对路径(不存在则创建)
                let fileNamedRelativeFolder = imagesFolder + path.sep + relativeGitRootPathWithoutExt
                let imageFileRelativePath = fileNamedRelativeFolder + path.sep + imgName;
                // windows 上使用 xcopy 命令
                let cmdStr = folderRoot + ' && ' +
                    'cd ' + localFolder + ' && ' +
                    '(if not exist ' + fileNamedRelativeFolder + ' mkdir ' + fileNamedRelativeFolder + ') && ' +
                    'xcopy "' + fsPath + '" "' + fileNamedFolder + '" /y ' + ' && ' +
                    'git add "' + imageFileRelativePath + '" && ' +
                    'git commit -m "' + doc.fileName.split(path.sep).pop() + '" && ' +
                    'git push'
                console.log(cmdStr)
                exec(cmdStr, { encoding: binaryEncoding }, function(err, stdout, stderr) {
                    if (err) {
                        console.log('wrong:' + iconv.decode(new Buffer(stderr, binaryEncoding), encoding))
                        
                        editor.edit(textEditorEdit => {
                            textEditorEdit.insert(editor.selection.active, 'wrong: ' +
                                iconv.decode(new Buffer(stderr, binaryEncoding), encoding) + ', cmdStr: ' + cmdStr)
                        })
                    } else {
                        console.log(iconv.decode(new Buffer(stdout, binaryEncoding), encoding))
                    }
                })
                // 将 \ 替换为 /, 并只对空格进行转义, 其他的一些特殊字符几乎不使用, 这样也保留了原始的中文, 看着会比较清晰
                let imgUrl = '![' + imgName.substring(0, imgName.length - 4) + ']' +
                    '(https://www.github.com/' + remoteRepo +'/raw/master/' +
                    imageFileRelativePath.replace(/\\/g,"\/")
                        .replace(/\s+/g, "%20") +
                    ')'
                editor.edit(textEditorEdit => {
                    textEditorEdit.insert(editor.selection.active, imgUrl)
                })
            }
        }, error)
        
    });
        

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;