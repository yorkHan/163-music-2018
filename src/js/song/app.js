{
    let view={
        el:'#app',
        render(data){
            let {song}=data
            $('div.bg').css('background-image',`url(${song.cover})`)
            $(this.el).find('img.cover').attr('src',song.cover)
            $(this.el).find('audio').attr('src',song.url)
        },
        play(){
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
                this.view.play()
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
