{
    let view={
        el:'#app',
        render(data){
            let {song}=data
            $('div.bg').css('background-image',`url(${song.cover})`)
            $(this.el).find('img.cover').attr('src',song.cover)
            $(this.el).find('.song-description>h1').text(song.name) 
            let {lyrics} = song
            let array=lyrics.split('\n')
            array.map((string)=>{
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                let para = $(`<p></p>`)
                let time=matches[1].split(':')
                let minute=time[0]*60
                let second=time[1]
                let newTime=parseInt(minute,10)+parseFloat(second,10)
                if(matches){
                    para.text(matches[2])
                    para.attr('data-time',newTime)
                    $(this.el).find('.lyric>.lines').append(para)
                }else{
                    para.text(string)
                }
            })
            let audio=$(this.el).find('audio').attr('src',song.url).get(0)
            audio.ontimeupdate=()=>{
                this.showLyric(audio.currentTime)
            }
            audio.onended=()=>{
                this.pause()
            }
        },
        showLyric(time){
            let allP=$(this.el).find('.lyric>.lines>p')
            let p
            for(let i=0;i<allP.length;i++){
                if(i===allP.length-1){
                    p=allP[i]
                    break
                }else{
                    let currenttime=allP.eq(i).attr('data-time')
                    let nextTime=allP.eq(i+1).attr('data-time')
                    if(currenttime<=time&&time<nextTime){
                    p=allP[i]
                    break
                }
            } 
            }
            let pHeight=p.getBoundingClientRect().top
            let lineHeight=$(this.el).find('.lyric>.lines')[0].getBoundingClientRect().top
            let height=pHeight-lineHeight
            $(this.el).find('.lyric>.lines').css({
                transform:`translateY(${-(height)}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
        },
        play(data){
            $(this.el).find('audio')[0].play()
            $(this.el).find('.disc-container').addClass('playing')
        },
        pause(){
            $(this.el).find('audio')[0].pause()
            $(this.el).find('.disc-container').removeClass('playing')
        }
    }
    let model={
        data:{
            song:{
                id:'',
                name:'',
                singer:'',
                url:'',
                cover:'',
                lyrics:'',
            },
            status:'paused'
        },
        getId(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{
                Object.assign(this.data.song,{id:song.id,...song.attributes})
                return song
            })
        }
    }
    let controller={
        init(model,view){
            this.view=view
            this.model=model
            this.bindEvents()
            let id=this.getSongId()
            this.model.getId(id).then((data)=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','.icon-play',()=>{
                this.view.play(this.model.data)
            })
            $(this.view.el).on('ended','audio',()=>{
                this.view.pause()
            })
            $(this.view.el).on('click','.icon-pause',()=>{
                this.view.pause()
            })
        },
        getSongId(){
            let search=window.location.search
            if(search.indexOf('?')===0){
                search=search.substring('1')
            }
            let array=search.split('&').filter((v=>v))
            let id=''
            for(var i=0;i<array.length;i++){
                let  kv=array[i].split('=')
                let  key=kv[0]
                let  value=kv[1]
                if(key==='id'){
                    id=value
                    break
                }
            }
            return id
        }
    }
    controller.init(model,view)
}
