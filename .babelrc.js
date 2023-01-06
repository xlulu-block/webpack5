module.exports = {
    presets: [
      [
        "@babel/preset-env",
        {
            module:false,//生产环境自动剔除废代码
          // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
          // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
          // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
          useBuiltIns: "entry",
          corejs: "7.20.12", // 是 core-js 版本号
          targets: {
            chrome: "58",
            ie: "11",
          },
        },
      ],
    ],
    plugins: [    
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],//这两个插件处理还没进入ECMA的新特性
      ]
  };