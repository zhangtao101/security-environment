<script>
	export default {
		onLaunch: function() {
			    plus.navigator.setFullscreen(true);

			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 所有页面容器下移 */
	.uni-app--wrapper {
	  padding-top: 1em !important; /* 下移距离 */
	}
</style>
