# jqeury-file-upload-demo
A demo use  blueibm 'jquery-file-upload' plugin



> 当你无法分辨长的很像的英文的时候，能够拯救你的就只有一遍又一遍的试错了。

## 前言介绍
最近项目需要一个页面单独上传的功能，要求页面能够做到多文件上传。于是便去寻找 ajax 上传文件的插件，找到 github 排名最高的 'jQuery-File-Upload' 插件，开发者是 'buleibm'。一开始还没想过这是谁，后来看到越来越多插件的作者是 'blueibm'，一想，原来这货是IBM啊 Ψ(￣∀￣)Ψ  
给出官方文档地址：https://github.com/blueimp/jQuery-File-Upload/wiki

## 简单开始
只需要简单的 ajax 上传功能很容易配置，首先，引入必要的`js`文件
```
<script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
<script src="//cdn.bootcss.com/blueimp-file-upload/9.17.0/js/vendor/jquery.ui.widget.min.js"></script>

<!-- 可选，用于兼容古代浏览器 -->
<script src="//cdn.bootcss.com/blueimp-file-upload/9.17.0/js/jquery.iframe-transport.min.js"></script>
<script src="//cdn.bootcss.com/blueimp-file-upload/9.17.0/js/jquery.fileupload.min.js"></script>
```
然后调用初始化代码
```
<input id="fileupload" type="file" name="files[]" data-url="server.php" multiple>
<script>
    $('#fileupload').fileupload();
</script>
```
搞定（`data-url`用于配置文件上传的地址，也可以配置到 js 的初始化代码中）


## 上传进度
记得前几年想做文件上传进度显示是非常麻烦的，需要手动写方法不断向服务端请求上传的进度。如今，在 html5 的光环下，显示文件上传进度已经变得非常容易了。`jquery-file-upload`插件提供一个配置函数用于监听文件的上传进度，在初始化代码中配置，如下代码即可
```
progress: function(e,data){
	var progress = parseInt(data.loaded / data.total * 100, 10);
	console.log(progress);
}
```


## 队列模式
这个页面要求的是多文件上传，总不能等一批文件上传了再上传另一批文件吧？所以文件上传队列功能就比较重要，其实也就是像模仿百度云、微云之类的文件上传方式。只需要添加一个配置项即可
```
sequentialUploads: true
```
这个时候，上传多个文件就能够实现一个文件接着一个文件上传的效果了，不得不说，这个插件确实很强大。


## 图片预览
扒拉扒拉上传一堆图片，结果想不起来哪些图片已经上传成功，这下就尴尬了。所以简单的图片预览功能也不能少。

前端显示图片有两种方式，一种是通过`img`标签加上`src`属性（由于使用服务端的图片地址会带来额外的开销，img 的方式也会选择本地的图片转换成 base64 编码直接在浏览器显示），另一种就是通过生成`canvas`直接显示图片。

最初的想法是使用`file`绑定的文件直接生成一个`base64`地址，获取`file`值的办法就是找到对应元素，使用 js 获取其`value`， 但是在同时添加多个文件的时候，没有办法获取到所选文件的列表，尝试在`add`方法中打印出来每一个文件的`data`数据，但是打印出来`file`的`value`都是同一个，尝试了很多遍，都是一样的结果。所以，这个思路失败。

然后就开始查看官方的例子，发现就有自带图片预览功能。据调查发现，这款插件使用的是 canvas  的方式。要实现图片预览的功能还需要添加额外的 js 文件
```
<script src="//cdn.bootcss.com/blueimp-load-image/2.12.2/load-image.all.min.js"></script>
<script src="//cdn.bootcss.com/blueimp-file-upload/9.17.0/js/jquery.fileupload-image.min.js"></script>
```
这个时候生成的file对象中已经添加好了`preview`子对象（是一个canvas元素），应该在什么时候使用这个子对象呢？也找不到官方的说法，只能自己啃官方给的例子的源代码。最后发现，canvas添加到页面是绑定在`processalways`事件中，同时添加生成 canvas 最大宽度和高度，代码如下：
```
previewMaxWidth: 512,
previewMaxHeight: 5000000,
processalways: function(e,data) {
	var index = data.index,
		preview = data.files[index].preview;
	console.log(preview);
}
```
另外，因为用到了`process`的绑定，还需要引入 js 文件
```
<script src="//cdn.bootcss.com/blueimp-file-upload/9.17.0/js/jquery.fileupload-process.min.js"></script>
```
这个文件一定要在`jquery.fileupload-image.min.js`文件前引入，否则页面会报错（坑爹的官方不给解释啊）

自己一直卡在这一步，在完成图片预览功能之后，发现进度显示功能出问题了，进度条不再刷新。一直找，一直找，直到发现`process`和`progress`是两个单词后，恍然大悟（进度不再更新的原因就是一直把两个单词当做了同一个，所以`progress`的功能写到了`process`里面，而`process`只会执行一次），一眼看错，浪费两小时，说得就是这回事了。


## 其他
额外还有一些小功能，文件类型的限制，拖拽功能等，参加如下：
```
acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
dropZone: $(document),
```
其他一些功能可以参加官方文档详阅。


## 总结
之前也做过一些文件上传的功能，要么就是停留在本文中的 '简单开始'，要么就是使用整个打包好直接使用的插件`bootstrap-file-upload`，这也是第一次使用功能自己搭配的组件，认识到了插件的强大可扩展的功能，IBM果然还是厉害。同时项目也使用了`vue`，确实非常的好用，以下给出自己的本文的一个 demo 仓库，自行查看。  
https://github.com/LancelotLewis/jqeury-file-upload-demo
