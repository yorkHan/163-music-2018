{
    let view={
        el:'#app',
        template:`
        <audio src={{url}}></audio>
        <div class="play"></div>
        `,
        render(data){
            $(this.el).html(this.template.replace('{{url}}', data.url))
        },
        play(){
            let audio=$(this.el).find('audio')[0]
            audio.play()
        },
        pause(){
            let audio=$(this.el).find('audio')[0]
            audio.pause()
        }
    }
    let model={
        data:{
            id:'',
            name:'',
            singer:'',
            url:''
        },
        getId(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{
                Object.assign(this.data,{id:song.id,...song.attributes})
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
                this.view.play()
            })
        },
        bindEvents(){
            $(this.view.el).on('trigger','.play',()=>{
                this.view.play()
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
