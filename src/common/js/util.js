import { login, wxAuth } from '@/api/auth.js';

let _debounceTimeout = null,
  _throttleRunning = false;

/**
 * 防抖
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const debounce = (fn, delay = 500) => {
  clearTimeout(_debounceTimeout);
  _debounceTimeout = setTimeout(() => {
    fn;
  }, delay);
};
/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const throttle = (fn, delay = 500) => {
  if (_throttleRunning) {
    return;
  }
  _throttleRunning = true;
  fn();
  setTimeout(() => {
    _throttleRunning = false;
  }, delay);
};
/**
 * toast
 */
export const msg = (title = '', param = {}) => {
  if (!title) return;
  uni.showToast({
    title,
    duration: param.duration || 1500,
    mask: param.mask || false,
    icon: param.icon || 'none',
  });
};
/**
 * 检查登录
 * @return {Boolean}
 */
export const isLogin = (options = {}) => {
  const token = uni.getStorageSync('token');
  if (token) {
    return true;
  }
  if (options.nav !== false) {
    uni.navigateTo({
      url: '/pages/auth/login',
    });
  }
  return false;
};
/**
 * 获取页面栈
 * @param {Number} preIndex为1时获取上一页
 * @return {Object}
 */
export const prePage = (preIndex = 1) => {
  const pages = getCurrentPages();
  const prePage = pages[pages.length - (preIndex + 1)];

  return prePage.$vm;
};

//二维数组去重
export const getUnique = (array) => {
  let obj = {};
  return array.filter((item, index) => {
    let newItem = item + JSON.stringify(item);
    return obj.hasOwnProperty(newItem) ? false : (obj[newItem] = true);
  });
};

// 复制
export const copy = (str) => {
  if (!str) return '';
  uni.showToast({
    title: '复制成功',
    icon: 'none',
  });
  uni.setClipboardData({
    data: str,
    success: function () {
      console.log('success');
    },
  });
};
// 打电话
export const callPhone = (str) => {
  if (!str) return '';
  uni.makePhoneCall({
    phoneNumber: str,
    success: function () {
      console.log('success');
    },
    fail: function () {},
  });
};
// 图片加载失败
export const onImageError = (list, index, url) => {
  console.log('onImageError', list, index, url);
  if (index == -1) return (this[list][url] = '//health-h5.oss-cn-beijing.aliyuncs.com/618/load.jpg');
  this[list][index][url] = '//health-h5.oss-cn-beijing.aliyuncs.com/618/load.jpg';
};


// 预览图片
export const previewImg = (list = [], current = 0) => {
  console.log('previewImg', list, typeof list);
  if (!list) {
    return;
  }
  if (typeof list == 'string') {
    console.log('String');
    list = [list];
  }

  let urls = list;
  uni.previewImage({
    current: current,
    urls: urls,
    longPressActions: {
      itemList: ['发送给朋友', '保存图片', '收藏'],
      success: function (data) {
        console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
      },
      fail: function (err) {
        console.log(err.errMsg);
      },
    },
  });
};

export const numFormat = (num) => {
  if (!num) return '0.00';
  let str = ''; //字符串累加
  str = (Math.round(num * 100) / 100)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
      return $1 + ',';
    });
  return str; //字符串=>数组=>反转=>字符串
};
// 示例toRawType('');  'String'toRawType([]);  'Array' 判断类型
export const toRawType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1);
};

// 下载图片
export const download = (str, callback) => {
  const _self = this;
  if (!str) {
    uni.showToast({
      title: '图片不存在',
      icon: 'none',
    });
    return false;
  }
  uni.showLoading({
    title: '正在下载',
  });
  uni.downloadFile({
    url: str,
    success: (res) => {
      var benUrl = res.tempFilePath;
      console.log(res);
      // #ifdef H5
      if (res.statusCode === 200) {
        console.log('下载成功');
        var oA = document.createElement('a');
        oA.download = ''; // 设置下载的文件名，默认是'下载'
        oA.href = res.tempFilePath; //临时路径再保存到本地
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
      }

      // #endif

      // #ifdef MP-WEIXIN

      if (callback) {
        callback(benUrl);
      } else {
        //图片保存到本地相册
        uni.saveImageToPhotosAlbum({
          filePath: benUrl,
          //授权成功，保存图片
          success: (data) => {
            console.log('downloadFile', data);
            uni.showToast({
              title: '下载成功',
              icon: 'success',
              duration: 2000,
            });
          },
          //授权失败
          fail: (err) => {
            if (err.errMsg) {
              console.log('err', err);
              //重新授权弹框确认
              uni.hideLoading();
              uni.showModal({
                title: '提示',
                content: '您好,请先授权，在保存此图片。',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    //重新授权弹框用户点击了确定
                    uni.openSetting({
                      //进入小程序授权设置页面
                      success(settingdata) {
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          //用户打开了保存图片授权开关
                          uni.saveImageToPhotosAlbum({
                            filePath: benUrl,
                            success: (data) => {
                              uni.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000,
                              });
                            },
                          });
                        } else {
                          //用户未打开保存图片到相册的授权开关
                          uni.showModal({
                            title: '温馨提示',
                            content: '授权失败，请稍后重新获取',
                            showCancel: false,
                          });
                        }
                      },
                    });
                  }
                },
              });
            }
          },
        });
      }

      // #endif
      uni.hideLoading();
    },
    fail(err) {
      uni.hideLoading();
      console.log('downloadFile err', err);
      if (err.errMsg == 'downloadFile:fail createDownloadTask:fail url not in domain list') {
        this.$msg('合法域名校验出错');
      }

      // #ifdef H5
      this.$msg('保存失败，请点击图片进行下载');
      // #endif
    },
  });
};



export const again_login = () => {
  let _self = this;
  var code;
  // #ifdef MP-WEIXIN
  // https://blog.csdn.net/qq_32930863/article/details/109961853 Token管理(获取、过期处理、异常处理及优化)
  uni.login({
    provider: 'weixin',
    success: (vx_res) => {
      code = vx_res.code;
      uni.setStorageSync('vx_codes', vx_res.code);
      login({
        code: code,
      }).then((data) => {
        if (data.code == 0) {
          uni.setStorageSync('token', data.data.token);
          console.log('老用户 成功登陆', data);
          reload();
        } else {
          console.log('这是一个新用户', data);
        }
      });
    },
    fail: () => {
      uni.showToast({ title: '获取 code 失败', icon: 'none' });
      return false;
    },
  });
  // #endif

};
export const reload = () => {
  const pages = getCurrentPages();
  const curPage = pages[pages.length - 1] || '';
  curPage.onLoad(curPage.options); // 传入参数
  curPage.onShow(curPage.options);
  curPage.onReady();
};

export const setUserStorage = (userInfo) => {
  try {
    const { avatarUrl, nickName, gender } = userInfo;
    uni.setStorageSync('user_avt', avatarUrl);
    uni.setStorageSync('user_nm', nickName);
    uni.setStorageSync('gender', gender);
  } catch (error) {
    console.warn(error);
  }
};

export const getUrlParam = (name) => {
  const local = window.location.href;
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(local) || [, ''])[1].replace(/\+/g, '%20')) || null;
};

// #endif
