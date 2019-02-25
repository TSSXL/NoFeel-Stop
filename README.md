# SPS_Back
>域名修改：config下的index.js找到
    `proxyTable: {
      "/sps": {
        target: "http://192.168.1.125/Sps/",
        changeOrigin: true,
        pathRewrite: {
          '^/sps': '/'
        }
      }
    },`
    修改target（接口文档api/xxx前的内容）
上面的代理只适合开发阶段已废弃
如需修改请打开src——>main.js

>图片路径修改：
    static下的urlf.js 的mainurl。同上