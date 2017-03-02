function checkUpload(){
	var files = vm.files;
	for(var i=0,len=vm.files.length;i<len;i++){
		if(!files[i].error && files[i].progress<100){
			return '文件还未上传完成，是否要离开页面';
		}
	}
};
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
	$('#fileupload').fileupload({
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
		sequentialUploads: true,
		dropZone: $(document),
		previewMaxWidth: 512,
		previewMaxHeight: 5000000,
		imageType: 'image/jpg'
		// previewCrop: true
	}).on('fileuploadadd', function (e, data) {
		var files = data.files;
		for(var i=0,len=files.length;i<len;i++){
			var index = i;
			// todo 本地上传图片的预览
			// 上传文件前检查文件是否有误/文件是否已经上传
			$.ajax({
				url: 'server.php?1',
				data: {
					data: files[index].name
				},
				dataType: 'json',
				success: function(result){
					if(result.status == 0){
						files[index].error = '文件名不对';
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
		}
	}).on('fileuploadprocessdone', function(e,data) {
		var index = data.index,
				preview = data.files[index].preview;
		if(preview){
			for(var i=0,len=vm.files.length;i<len;i++){
				if(data.files[index] === vm.files[i]){
					$($fileList.find('tr').eq(i)).find('.hover').append(preview);
				}
			}
		}
	}).on('fileuploadprogress',function(e,data){
		var progress = parseInt(data.loaded / data.total * 100, 10);
		for(var i=0,len=vm.files.length;i<len;i++){
			if(data.files[0] === vm.files[i]){
				data.files[0].progress = progress;
				Vue.set(vm.files,i,data.files[0]);
			}
		}
	});
});