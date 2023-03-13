/*
 * @Date: 2022-05-17 10:52:10
 * @LastEditors: mixcoding
 * @LastEditTime: 2023-02-24 17:22:45
 */
import { request_401, again_login, getWxAuth, reload } from '@/common/js/util.js';
import cache from '@/common/js/cache';
const showToast = (options) => {
  let { title, duration, icon } = options;
  uni.showToast({
    title: title,
    duration: 1000,
    icon: icon || 'none',
  });
};
const authCall = (cal) => {
  if (cal.code == 1) {
    console.log('授权失败', cal);
    isRefreshing = true;
    cache.put('isTokenExpire', true);
  } else {
    isRefreshing = false;
    console.log('成功获取token', cal);
    cache.put('isTokenExpire', false);
    let locationUrl = window.location.href.split('#');
    if (locationUrl[0].indexOf('?') > -1) {
      let pre = locationUrl[0].split('?')[0];
      window.location.href = pre + '#' + locationUrl[1];
    }
  }
};

let isRefreshing = true;
let subscribers = [];

const onAccessTokenFetched = () => {
  console.log('subscribers', subscribers);
  subscribers.forEach((callback) => {
    console.log('callback', callback());
    callback();
  });
  subscribers = [];
};

const addSubscriber = (callback) => {
  subscribers.push(callback);
};

const request = (
  url = '',
  data = {},
  type = 'GET',
  loading = 'showLoading',
  header = {
    Authorization: `Bearer ${uni.getStorageSync('token')}`,
  },
  callback = ''
) => {
  if (loading == 'showLoading') {
    uni.showLoading({
      title: '加载中',
    });
  }
  if (type == 'POST') {
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${uni.getStorageSync('token')}`,
    };
  }

  return new Promise((resolve, reject) => {
    uni
      .request({
        method: type,
        url: url,
        data: { ...data, environment: uni.getStorageSync('env').indexOf('H5') > -1 ? 'h5' : 'wxapp' },
        // data: data,
        header: header,
        dataType: 'json',
        callback,
      })
      .then(async (response) => {
        // if (cache.get('isTokenExpire')) return false;
        if (loading == 'showLoading') {
          uni.hideLoading();
        }
        let [error, res] = response;
        if (callback) return callback(res.data);
        if (res.statusCode != 200) {
          return showToast({
            title: `请求异常：状态码${res.statusCode}`,
          });
        }
        if (res.data.code == 0 || res.data.code == 1 || res.data.code == 4009) {
          if (res.data.code == 1) {
            showToast({
              title: res.data.message,
            });
          }
          resolve(res.data);
        } else if (res.data.code == 401) {
          // 授权过期 401 微信登录过期 4007 webview获取信息
          cache.put('isTokenExpire', true);
          // #ifdef H5
          // if (isRefreshing) {
          //   await getWxAuth('overdue', authCall);
          // }

          let _t = parseInt(new Date().valueOf() / 1000);
          let new_t = cache.get('_t');
          if (!new_t) {
            cache.put('_t', _t);
          } else {
            if (new_t < _t - 10) {
              cache.put('_t', _t);
            } else {
              return;
            }
          }

          uni.removeStorageSync('token');
          let locationUrl = window.location.href.split('#');
          if (locationUrl[0].indexOf('?') > -1 && locationUrl[0].indexOf('code') > -1) {
            let pre = locationUrl[0].split('?')[0];
            let h5_url = pre + '#' + locationUrl[1];
            cache.put('h5_url', h5_url);
            window.location.href = pre + '#' + locationUrl[1];
          } else {
            // window.reload();
            await getWxAuth();
          }
          // #endif

          // #ifdef MP-WEIXIN
          again_login();
          // #endif
          // resolve(res.data);
        } else if (res.data.code == 4008) {
          //4008 尚未关注公众号
          console.log('请先关注公众号');
          resolve(res.data);
        } else if (res.data.code == 40078) {
          //4007 直接跳转 跳转webview
          // request_401();
          // 双十一活动 4007 尚未关注 照常请求
          resolve(res.data);
        } else {
          if (error.errMsg) {
            showToast({
              title: error.errMsg,
            });
          } else {
            showToast({
              title: res.data.message,
            });
          }
        }
      })
      .catch((error) => {
        let [err, res] = error;
        console.log('error', err, res);
        reject(err);
      });
  });
};

// 拦截器
uni.addInterceptor('request', {
  invoke(args) {
    // request 触发前拼接 url
    // console.log('args',args)
  },
  success(args) {
    // 请求成功后，修改code值为1
    let { statusCode, code } = args;
    if (statusCode == 200) {
      if (code == 401) {
        // #ifndef MP-WEIXIN
        again_login();
        // #endif
      }
    } else {
      console.warn(args);
    }
  },
  fail(err) {
    console.log('interceptor-fail', err);
    showToast({
      title: '请求失败,请尝试重新打开',
    });
  },
  complete(res) {},
});

export default request;
