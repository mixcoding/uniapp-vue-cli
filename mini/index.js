/*
 * @Date: 2023-03-07 15:48:16
 * @LastEditors: mixcoding
 * @LastEditTime: 2023-03-07 15:49:23
 */
const { exec } = require('child_process');

// 启动 Vue 项目
exec('npm run mini', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});
