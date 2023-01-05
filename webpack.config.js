const path = require('path')
// js或者css文件自动引入到html中用到的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 分离样式文件，style-loader是以style标签形式改变样式，这个插件是以css引入改变样式
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 自动清空打包目录插件
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量
const config = {
    mode: 'development', //模式
    entry: './src/index.js', // 打包入口地址
    //   webpack只能打包js和json文件，如果要打包其他类型的文件，则需要loader来帮助
    output: {
        filename: 'bundle.js', // 输出文件名
        path: path.join(__dirname, 'dist') // 输出文件目录
    },
    module: {
        rules: [ //转换规则
            {
                test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
                // use: ['style-loader','css-loader','postcss-loader','sass-loader'],
                use: [
                    MiniCssExtractPlugin.loader, //利用插件以css形式引入
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
                //执行顺序，由后往前  style-loader:将css文件自动引入页面中。css-loader：使webpack能够处理css文件。postcss-loader:css兼容，自动添加前缀
                //sass-loader:程序中可以使用sass预处理编译
                //安装sass-loader需要安装node-sass，这个大概率会出问题，安装sass就行
            },
            {
                test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
                use:[
                  'file-loader' // 使用 file-loader,解决图片引入路径的问题
                ]
              }
        ]
    },
    plugins: [ //配置插件,多个插件，后缀s
    // 将js，css引入html中
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        //打包清空上次打包文件
        new CleanWebpackPlugin({}),
        // 添加引入css插件
        new MiniCssExtractPlugin({ 
            filename: '[name].[hash:8].css'
          }),


    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'public'), // 静态文件目录  webpack-dev-serve版本大于4.0.0时需要用devServe.static进行配置
        //   打包时，会将静态图片和文件直接复制到dist目录下，但是对于本地开发会更费时，配置了contentBase就会直接去对应的目录下去读取文件，而不需要移动，节省了时间和性能开销
        compress: true, //是否启动压缩 gzip
        port: 8080, // 端口号
        // open:true  // 是否自动打开浏览器
    },
}
module.exports = (env, argv) => {
    console.log('argv.mode=', argv.mode); //打印mode（模式）值
    // 这里可以通过不同的模式修改config配置
    return config
}