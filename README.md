### Loader 就是将 Webpack 不认识的内容转化为认识的内容
1.webpack只能打包js，json文件。引入loader后可以进行转换，从而执行打包程序。

### Plugin 会贯穿webpack的整个生命周期，执行不同的任务
1.可以自动将js，css文件引入html中

### 本地环境：

需要更快的构建速度
需要打印 debug 信息
需要 live reload 或 hot reload 功能
需要 sourcemap 方便定位问题
...

### 生产环境：

需要更小的包体积，代码压缩+tree-shaking
需要进行代码分割
需要压缩图片体积
...