<!--
 * @Date: 2023-03-07 15:45:44
 * @LastEditors: mixcoding
 * @LastEditTime: 2023-03-13 15:33:23
-->
<template>
	<view class="content_wrap flex-column">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
.content_wrap{
	
}
</style>
