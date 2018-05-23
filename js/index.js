var EventCenter = {
    on: function(type, handler){
        $(document).on(type, handler)
    },
    fire: function(type, data){
        $(document).trigger(type, data)
    }
}

var Footer = {
    init: function(){
        this.$footer = $('footer')
        this.$ul = this.$footer.find('ul')
        this.$box = this.$footer.find('.box')
        this.$leftBtn = this.$footer.find('.icon-left')
        this.$rightBtn = this.$footer.find('.icon-right')
        this.istoEnd = false
        this.istoStart = true
        this.isAnimate = false
        this.bind()
        this.render()
    },
    bind: function(){
        var _this = this
        this.$rightBtn.on('click', function(){
            if(_this.isAnimate) return
            var itemWidth = _this.$box.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width()/itemWidth)
            if(!_this.istoEnd){
                _this.isAnimate = true
                _this.$ul.animate({
                    left: '-='+rowCount*itemWidth
                }, 400, function(){
                    _this.isAnimate =false
                    _this.istoStart = false
                    if(parseFloat(_this.$box.width()) - parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.css('width'))){
                        _this.istoEnd = true
                    }
                }) 
            }

        })
        this.$leftBtn.on('click', function(){
            if(_this.isAnimate) return 
            var itemWidth = _this.$box.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width()/itemWidth)
            if(!_this.istoStart){
                _this.isAnimate = true
                _this.$ul.animate({
                    left: '+='+rowCount*itemWidth
                }, 400, function(){
                    _this.isAnimate = false
                    _this.istoEnd = false
                    if(parseFloat(_this.$ul.css('left')) >= 0){
                        _this.istoStart =true
                    }
                })
            }
        })
        this.$footer.on('click', 'li', function(){
            $(this).addClass('active')
                   .siblings().removeClass('active')
            
            EventCenter.fire('select-albumn', {
                channelId: $(this).attr('data-channel-id'),
                channelName: $(this).attr('data-channel-name')
            })
        })
    },
    render: function(){
        var _this = this
        $.getJSON('https://jirenguapi.applinzi.com/fm/getChannels.php')
            .done(function(ret){
                _this.renderFooter(ret.channels)
            }).fail(function(){
                console.log('error')
            })
    },
    renderFooter: function(channels){
        var html = ''
        channels.unshift({
            channel_id: 0,
            name: '我的最爱',
            cover_small: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-small',
            cover_middle: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-middle',
            cover_big: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-big',
        })
        channels.forEach(function(channel){
            html += '<li data-channel-id='+channel.channel_id+' data-channel-name='+channel.name+'>'
                 + '   <div class="cover" style="background-image:url('+channel.cover_small+')"></div>'
                 + '   <h3>'+channel.name+'</h3>'
                 + '</li>'
        })
        this.$ul.html(html)
        this.setStyle()
        this.$ul.find('li:first').addClass('active')
            .siblings().removeClass('active')
    },
    setStyle: function(){
        var count = this.$footer.find('li').length
        var width = this.$footer.find('li').outerWidth(true)
        this.$ul.css({
            width: count*width + 'px'
        })
    }
}

var FM = {
    init: function(){
        this.$container = $('#page-music')
        this.audio = new Audio()
        this.bind()
        EventCenter.fire('select-albumn', {
            channelId: 0,
            channelName: '我的最爱'
        })
        this.audio.autoplay = true
    },
    bind: function(){
        var _this = this
        EventCenter.on('select-albumn', function(e, channelObj){
            _this.channelId = channelObj.channelId
            _this.channelName = channelObj.channelName
            // if(_this.channelId === 0){
            //     _this.loadMusic()
            // }else {
            _this.loadMusic()
                // _this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-pause')
            // }
        })
        this.$container.find('.btn-play').on('click', function(){
            var $btn = $(this)
            if($btn.hasClass('icon-play')){
                $btn.removeClass('icon-play').addClass('icon-pause')
                _this.audio.play()
            }else{
                $btn.addClass('icon-play').removeClass('icon-pause')
                _this.audio.pause()
            }
        })
        this.$container.find('.btn-next').on('click', function(){
            _this.loadMusic()
            _this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-pause')
        })
        this.audio.addEventListener('play', function(){
            clearInterval(_this.statusClock)
            _this.statusClock = setInterval(function(){
                _this.updateStatus()
            }, 1000)
        })
        this.audio.addEventListener('pause', function(){
            clearInterval(_this.statusClock)
        })
    },
    loadMusic: function(){
        var _this = this
        $.getJSON('https://jirenguapi.applinzi.com/fm/getSong.php', {channel: _this.channelId})
         .done(function(ret){
            _this.song = ret.song[0]
            _this.setMusic()
            _this.loadLyric()
         })
    },
    loadLyric: function(){
        var _this = this
        $.getJSON('https://jirenguapi.applinzi.com/fm/getLyric.php', {sid: _this.song.sid})
         .done(function(ret){
            var lyric = ret.lyric
            var lyricObj = {}
            lyric.split('\n').forEach(function(line){
                var times = line.match(/\d{2}:\d{2}/g)
                var str = line.replace(/\[.+?\]/g, '')
                if(Array.isArray(times)){
                    times.forEach(function(time){
                        lyricObj[time] = str
                    })
                }
                
            })
            _this.lyricObj = lyricObj
         })
    },
    setMusic: function(){
        var _this = this
        this.audio.src = this.song.url
        $('.bg').css('background-image', 'url(' + this.song.picture)
        this.$container.find('.detail h1').text(this.song.title)
        this.$container.find('.detail .author').text(this.song.artist)
        this.$container.find('.aside figure').css('background-image', 'url(' + this.song.picture)
        this.$container.find('.tag').text(this.channelName)
        _this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-pause')
        
    },
    updateStatus: function(){
        var min = Math.floor(this.audio.currentTime/60)
        var second = Math.floor(this.audio.currentTime%60)+''
        second = second.length ===2?second:'0'+second
        min = min.length ===2?min:'0'+min
        this.$container.find('.current-time').text(min + ':' + second)
        this.$container.find('.bar-progress').css('width', this.audio.currentTime/this.audio.duration*100+'%')
        var line = this.lyricObj[min+':'+second]
        if(line){
            this.$container.find('.lyric p').text(line).boomText()
        }
    }

}

$.fn.boomText = function(type){
    type = type || 'rollIn'
    this.html(function(){
        var arr = $(this).text()
        .split('').map(function(word){
            return '<span class="boomText">'+ word + '</span>'
        })
        return arr.join('')
    })

    var index = 0
    var $boomTexts = $(this).find('span')
    var clock = setInterval(function(){
        $boomTexts.eq(index).addClass('animated ' + type)
        index++
        if(index >= $boomTexts.length){
            clearInterval()
        }
    },200)
}

Footer.init()
FM.init()