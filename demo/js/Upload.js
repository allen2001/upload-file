/**
 * name: Upload.js
 * desc: 文件上传组件
 * date: 2019/1/5
 * author: allen2001
 */

/* 构造函数 Upload */
function Upload(btn, options) {
	// 触发按钮DOM
	this.btn = btn;
	// 上传配置参数
	this.options = options;
	// 上传百分比
	this.percentage = 0;

	// 初始化实例
	this.init();
}

/* 初始化 */
Upload.prototype.init = function() {
	// 保存当前实例
	var _this = this;
	// 绑定点击事件 选择文件
	this.btn.addEventListener('click', function(ev) {
		// 创建一个file input (只能选择一个文件)
		var input = document.createElement('input');
		input.type = 'file';
		// 绑定input 选择文件后的回调
		input.onchange = function() {
			// 获取文件对象
			var file = this.files[0];
			// 创建formdata
			var formdata = new FormData();
			formdata.append(_this.options.name, file);
			// 发起一个ajax请求
			var xhr = new XMLHttpRequest();

			// 监听上传开始的事件
			xhr.addEventListener('loadstart', _this.options.onStart);
			// 监听progress事件
			xhr.upload.addEventListener('progress', function(ev) {
				if (ev.lengthComputable) {
					// 更新进度百分比
					_this.percentage = ev.loaded / ev.total;
					_this.options.onProgress(_this.percentage);
				}
			})
			// 监听上传结束的事件(不管成功与失败)
			xhr.addEventListener('loadend', _this.options.onEnd)

			var url = _this.options.url;
			xhr.open('POST', url);
			// 监听事件
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					var res = xhr.responseText;
					if (xhr.status == 200) {
						// 请求成功
						_this.options.onSuccess({
							status: 200,
							data: res
						});
					} else {
						// 请求失败
						_this.options.onError({
							code: xhr.status,
							message: res
						});
					}
				} else {
					// 请求未完成

				}
			}
			// 发送请求
			xhr.send(formdata);
		}
		// 自动触发选择文件操作
		input.click();
	}, false);
}

/* 上传文件 */
Upload.prototype.upload = function() {

}

/* 上传完成后重置回到初始状态 */
Upload.prototype.reset = function() {
	this.percentage = 0;
	
}