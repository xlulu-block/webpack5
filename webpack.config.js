const path = require('path')
// js或者css文件自动引入到html中用到的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 分离样式文件，style-loader是以style标签形式改变样式，这个插件是以link引入改变样式
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 引入插件可以直观的看到打包结果中，文件的体积大小、各模块依赖关系、文件是否重复等问题
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 压缩js
const TerserPlugin = require('terser-webpack-plugin')
// 清空无用css
const {PurgeCSSPlugin} = require('purgecss-webpack-plugin')
const glob = require('glob'); // 文件匹配模式
// 自动清空打包目录插件
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量
// 费时分析
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();
// 路径处理方法
function resolve(dir){
  return path.join(__dirname, dir);
}
const PATHS = {
  src: resolve('src')
}
const config = {
  mode: 'development', //模式
  entry: './src/index.js', // 打包入口地址
  //   webpack只能打包js和json文件，如果要打包其他类型的文件，则需要loader来帮助
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist') // 输出文件目录
  },
  // devtool: 'source-map', //SourceMap 是一种映射关系，当项目运行后，如果出现错误，我们可以利用 SourceMap 反向定位到源码位置
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
      // {
      //     test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
      //     use: [{
      //         loader:'file-loader',// 使用 file-loader,解决图片引入路径的问题
      //         options:{
      //             name: '[hash:8].[ext]',
      //             esModule:false
      //         }
      //     }],
      //     type: 'javascript/auto' //这个属性如果没有设置，则会生成两张图片(如果你的页面只引入了一张图片)
      // },
      // {
      //     test: /\.(jpe?g|png|gif)$/i,
      //     use: [{
      //         loader: 'url-loader',
      //         options: {
      //             name: '[name][hash:8].[ext]',
      //             // 文件小于 50k 会转换为 base64，大于则拷贝文件
      //             // 图片base64会提高性能，让图片和html一起下载下来，而不是通过请求服务器（减少http请求，提高性能）
      //             // 为什么将小的图片进行转换，不转换大的？ 因为大的转化后字符串长度会过长，导致css文件冗余
      //             limit: 50 * 1024,
      //             esModule: false,//webpack5官网不再推荐使用file-loader、url-loader，如果要用的话需要配置esModule：false
      //             // 建议不要同时使用file-loader和url-loader，这样可能会导致图片打包失败
      //         }
      //     }],
      //     type: "javascript/auto",
      // },
      {
        // webpack5 新增资源模块(asset module)，允许使用资源文件（字体，图标等）而无需配置额外的 loader(指file-loader和url-loader)。
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 //超过50kb不转 base64
          }
        }
      },
      {
        test: /\.js$/i,
        include: resolve('src'), //对src模块的文件进行解析
        exclude: /node_modules/, //排除node_modules,exclude优先级更高
        use: [{
          loader: 'babel-loader', //将es6代码转换为es5,这里的babel-loader暂时用的8.0.4，用最新的9.0+运行时回报找不到fs
          options: {
            presets: [
              '@babel/preset-env' //babel的超集
            ],
            cacheDirectory: true // 启用缓存
          }
        }]
      },
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
    // 配置插件 
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    }),

    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
    }),

  ],
  resolve: {
    // 配置别名
    alias: {
      '~': resolve('src'),
      '@': resolve('src'),
      'components': resolve('src/components'),
    },
    extensions: ['.js', '.json', '.wasm'],
  },
  // 服务及代理
  devServer: {
    contentBase: path.resolve(__dirname, 'public'), // 静态文件目录  webpack-dev-serve版本大于4.0.0时需要用devServe.static进行配置
    //   打包时，会将静态图片和文件直接复制到dist目录下，但是对于本地开发会更费时，配置了contentBase就会直接去对应的目录下去读取文件，而不需要移动，节省了时间和性能开销
    compress: true, //是否启动压缩 gzip
    port: 8080, // 端口号
    // open:true  // 是否自动打开浏览器
  },
  // 启动css压缩
  optimization: {
    minimize: true,//开启最小化
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
      // 添加js压缩配置
      new TerserPlugin({})
    ],
    // 分包配置
    splitChunks: {
      chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
      minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
      minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
      minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 最大的按需(异步)加载次数
      maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
      enforceSizeThreshold: 50000,
      cacheGroups: { // 配置提取模块的方案
        defaultVendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode); //打印mode（模式）值
  // 这里可以通过不同的模式修改config配置
  return config
}