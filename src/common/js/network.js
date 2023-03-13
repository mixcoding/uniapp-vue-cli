// 网络监听
export const network = {
	// 网络状态
	isConnect: false,
	// 监听网络状态
	on() {
		// 获取当前网络状态
		uni.getNetworkType({
			success: (res) => {
				console.log('res',res)
				if (res.networkType !== 'none') {
					this.isConnect = true;
					return;
				}
				uni.showToast({
					icon: "none",
					title: '请先连接网络',
				});
			}
		})
		// 监听网络状态变化
		uni.onNetworkStatusChange((res) => {
			this.isConnect = res.isConnected;
			if (!res.isConnected) {
				uni.showToast({
					icon: "none",
					title: '当前网络已断开',
					duration: 5000
				})
			}
		})
		console.log('this.isConnect', this.isConnect)
	}

}
