// require('./mock.js');
require('./progress.css');

function checkUpload(){
	var files = vm.files;
	for(var i=0,len=vm.files.length;i<len;i++){
		if(!files[i].error && files[i].progress<100){
			return '文件还未上传完成，是否要离开页面';
		}
	}
}
var vm = new Vue({
	el: '#fileList',
	template: '#tpl',
	data: {
		files: []
	},
	filters: {
		// 文件大小格式化
		format (value) {
			var suffix = ['B','K','M','G'];
			var index = 0;
			while(value>1023 && index< suffix.length){
				value /= 1024;
				index++;
			}
			return Math.round(value*1000)/1000+suffix[index];
		},
		message (msg) {
			var str = msg;
			switch(msg){
				case 'File type not allowed':
					str = '文件类型错误';
					break;
				case 'File is too large':
					str = '文件太大';
					break;
				case 'Maximum number of files exceeded':
					str = '文件数量超过限制';
					break;
				case 'File is too small':
					str = '文件太小';
					break;
				case 'Uploaded bytes exceed file size':
					str = '上传大小超过文件限制';
					break;
			}
			return str;
			// {
			// 	acceptFileTypes: ""
			// 	maxFileSize: ""
			// 	maxNumberOfFiles: ""
			// 	minFileSize: ""
			// 	uploadedBytes: ""
			// }
		}
	},
	methods: {
		// 删除已经上传成功或者未上传的文件列表
		deleteFile (index) {
			vm.files.splice(index,1);
		}
	}
});
var $fileList = $('.fileList');
$(function () {
	$.ajaxSetup({
		timeout : 60*60*1000,
		cache: false,
		dataType: 'json'
	});
	var $fileupload = $('#fileupload'),
		uploadUrl = $fileupload.data('upload'),
		checkUrl = $fileupload.data('check');
	$fileupload.fileupload({
		url: uploadUrl,
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
		sequentialUploads: true,
		dropZone: $('.content'),
		previewMaxWidth: 512,
		previewMaxHeight: 5000000,
		autoUpload: false,
		maxFileSize: 1*1024*1024,
		minFileSize: 10*1024,
		imageType: 'image/jpg',
		done: function(e, data){
			var res = data.result;
			var index = data.index;
			if(+res.status === 0){
				for(var i=0,len=vm.files.length;i<len;i++){
					if(data.files[index] === vm.files[i]){
						data.files[index].error = res.message;
						Vue.set(vm.files, i,data.files[index]);
					}
				}
			}
		}
	}).on('fileuploadprogress',function(e, data){
		var progress = parseInt(data.loaded / data.total * 100, 10);
		for(var i=0,len=vm.files.length;i<len;i++){
			if(data.files[0] === vm.files[i]){
				data.files[0].progress = progress;
				Vue.set(vm.files,i,data.files[0]);
			}
		}
	}).on('fileuploadprocess', function(e,data) {
		var files = data.files,
				index = data.index;
		console.log(files[index].name);
	}).on('fileuploadprocessdone', function(e, data) {
		var files = data.files,
			index = data.index;
		// todo 本地上传图片的预览
		// 上传文件前检查文件是否有误/文件是否已经上传
		if(checkUrl){
			$.ajax({
				url: checkUrl,
				data: {
					data: files[index].name
				},
				// cache: false,
				success: function(result){
					// console.log(index);
					// result.status = Math.round(Math.random(result.status));
					// console.log(result.status);
					if(result.status === 0){
						files[index].error = result.message?result.message:'文件已上传过';
						console.log(index);
						vm.files.push(files[index]);
					}else{
						files[index].progress = 0;
						vm.files.push(files[index]);
						data.process().done(function () {
							data.submit();
						});
					}
				},
				error: function(){
					return false;
				}
			});
		}else{
			files[index].progress = 0;
			vm.files.push(files[index]);
			data.process().done(function () {
				data.submit();
			});
		}
		// var index = data.index,
		// 		preview = data.files[index].preview;
		// if(preview){
		// 	for(var i=0,len=vm.files.length;i<len;i++){
		// 		if(data.files[index] === vm.files[i]){
		// 			console.log(preview);
		// 			$($fileList.find('tr').eq(i)).find('.hover').append(preview);
		// 		}
		// 	}
		// }
	}).on('fileuploadprocessfail', function(e, data) {
		var files = data.files,
				index = data.index;
		vm.files.push(files[index]);
	});
});
