## 名字： 爱我音乐电台

## 项目介绍： 这是一款适配于大屏幕全屏展示的音乐电台
*其中的API接口地址为http://api.jirengu.com/*
 
 该音乐电台分为两大块：音乐播放展示区和页面底部的音乐专辑选择区。刚进入页面时，会先显示第一个专辑的一首歌，点击播放展示当前歌曲（包括图片、作者、标题、时间、歌词等信息），点击下一曲的图标时，会显示下一曲。当点击页面底部的时候，页面展示区自动随机播放电台里的一首歌。页面底包括所有的专辑，大概40个吧，有左右轮播按钮，对应切换未展示的电台分类，当前进或者后退到最初或末尾的状态时，滚东效果失效。

 最重要的一点是：该电台全屏覆盖，适应于各种大屏屏幕，其中利用了flex布局与浮动结合，同时将所有需要设置自适应的元素大小以vh作为单位，使其能够与窗口大小等比缩放，展示出较好的效果。
**其中收藏、点赞功能未能实现，因为缺少相应的后台接口数据**

## 项目技术细节介绍
应用了HTML5和CSS3进行了页面设计，将页面分为2个结构：main 和 footer ,main里放置歌曲对应的图片、作者、标题、歌词、进度条以及切换按钮等元素，footer里放置了电台列表以及左右轮播按钮，其中利用背景图片的background-size: cover;来实现背景图片全屏覆盖。flex与浮动结合布局，使页面布局更合理。
利用jquery、ajax结合ainmate自定义动画来获取数据，并将其变成DOM结构放入页面
利用new Audio()来实现音乐的播放控制以及时间、进度条显示
### 属性
#### 1. audioObject
 创建或者获取的audio对象，可通过以下两种方式得到

**方法1:**
```html
<audio id="music" src="http://cloud.hunger-valley.com/music/玫瑰.mp3">你的浏览器不支持喔！</audio>
<script>
var audioObject = document.querySelector('#music')
</script>
```

**方法2**
```javascript
var audioObject = new Audio('http://cloud.hunger-valley.com/music/玫瑰.mp3')
```

#### 2. audioObject.play()
开始播放

#### 3. audioObject.pause()
暂停播放

#### 4. audioObject.autoPlay
设置或者获取自动播放状态

```javascript
audioObject.autoPlay = true  //设置为自动播放，下次更换 audioObject.src 后会自动播放音乐
audioObject.autoPlay = false //设置不自动播放
console.log(audioObject.autoPlay)
```

#### 5.audioObject.src
设置或者获取音乐地址

```javascript
audioObject.src = "http://cloud.hunger-valley.com/music/ifyou.mp3"
console.log(audioObject.src)
```
EventCenter（事件处理中心）将底部轮播歌曲展示通过一个监听事件来联系起来。
```
var EventCenter = {
    on: function(type, handler){
        $(document).on(type, handler)
    },
    fire: function(type, data){
        $(document).trigger(type, data)
    }
}

```
### 遇到的问题及解决方案
1. 怎么判断底部轮播到了尾部？
通过计算移动的距离加上窗口的距离>=轮播的总长度来判断
2. 怎么让进度条与时间同步显示？
进度条的宽度设为百分比，当前播放的时间与歌曲总时间的百分比就是当亲进度条宽度的百分比
3. 歌词提取、展示设置？
歌词是字符串，利用split将歌词分割成数组，每个元素里包含时间和歌词两部分，利用正则将时间和对应的歌词提取出来，并将其依次放入空对象中，形成key:value的形式，这样就能针对不同的时间展示展示不同的歌词。
4. http和https
因为要上传到github，所以浏览器就会默认阻止发送http请求，最后找到了，https协议的接口
### 收获
其实除了上述几个问题外，还有许多小问题，比如书写问题、逻辑问题等，对响应式的设计有了更深的了解，jquery、flex的运用更加熟练。最重要的收获就是逻辑思维和页面布局方式，也有了耐心，对页面设计时更加注重细节，事件代理中心了解加强了。
### 运用的技术栈
jquery、响应式、flex布局、浮动、定位、CSS3

### 效果浏览地址为：https://anybody-1.github.io/Music-My-FM/index.html