/*
 * @Date: 2023-03-07 16:52:26
 * @LastEditors: mixcoding
 * @LastEditTime: 2023-03-07 16:55:20
 */
// const ci = require('miniprogram-ci');

// 获取控制面板输入的参数
const args = process.argv.slice(2);

// 输出参数
console.log(args);

// 使用参数
if (args.includes('--commit')) {
  const index = args.indexOf('--commit');
  const name = args[index + 1];
  console.log(`Hello, ${name}!`);
}

const updateMini = async () => {
  const project = new ci.Project({
    appid: 'wx69298e1f5783c488',
    type: 'miniProgram',
    projectPath: 'dist/build/mp-weixin',
    privateKeyPath: 'appid.key',
    ignores: ['node_modules/**/*'],
  });

  const uploadResult = ci.upload({
    project,
    version: '0.0.6',
    desc: '新增部分功能 优化部分功能 ',
    setting: {
      es6: true,
    },
    robot: '001',
    onProgressUpdate: console.log,
  });
  const previewResult = await ci.preview({
    project,
    desc: '测试自动化发布是否成功 预览', // 此备注将显示在“小程序助手”开发版列表中
    setting: {
      es6: true,
    },
    qrcodeFormat: 'image',
    qrcodeOutputDest: '/path/to/qrcode/file/destination.jpg',
    onProgressUpdate: console.log,
    // pagePath: 'pages/index/index', // 预览页面
    // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
  });
  console.log(uploadResult);
  console.log(previewResult);
};
