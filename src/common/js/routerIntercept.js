/*
 * @Date: 2022-11-11 14:05:50
 * @LastEditors: mixcoding
 * @LastEditTime: 2022-11-11 14:16:57
 */
// 白名单
const whiteList = ['/', '/pages/Login/Login'];
const blackList = ['/module/pages/active_answer'];
console.log('url');
export default async function () {
  const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];
  // 用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
  console.log('url',list);
  list.forEach((item) => {
	console.log('url',item);
    uni.addInterceptor(item, {
      invoke(e) {
        // 获取要跳转的页面路径（url去掉"?"和"?"后的参数）
        const url = e.url.split('?')[0];
        console.log('url', url);
        // 判断当前窗口是白名单，如果是则不重定向路由
        // let pass;
        // if (whiteList) {
        //   pass = whiteList.some((item) => {
        //     if (typeof item === 'object' && item.pattern) {
        //       return item.pattern.test(url);
        //     }
        //     return url === item;
        //   });
        // }
        if (blackList.includes(url)) {
          console.log('命中');
        }else{
			console.log('没有命中');
		}

        return e;
      },
      fail(err) {
        // 失败回调拦截
        console.log(err);
      },
    });
  });
}
