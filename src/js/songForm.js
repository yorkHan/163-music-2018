{
    let view={
        el:'.page > main',
        init(){
            this.$el=$(this.el)
        },
        template:`
        <form class="form">
            <div class="row">
                <label>歌曲</label>
                <input name="name" type="text" value="___name___">
            </div>
            <div class="row">
                <label>歌手</label>
                <input name="singer" type="text" value="___singer___">
            </div>
            <div class="row">
                <label>外链</label>
                <input name="url" type="text" value="___url___">
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data={}){
            let placeholder=['name','singer','url']
            let html=this.template
            console.log(data)
            placeholder.map((string)=>{
                html=html.replace(`___${string}___`,data[string]||'')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend("<h1>编辑歌曲</h1>")
            }else{
                $(this.el).prepend("<h1>新建歌曲</h1>")
            }
        },
        reset(){
            this.render({})
        }
    }
    let model={
        data:{
            name:'',
            singer:'',
            url:'',
            id:''
        },
        create(data){
              // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var Song = new Song();
            // 设置名称
            Song.set('name',data.name);
            Song.set('singer',data.singer);
            Song.set('url',data.url);
            // 设置优先级
            Song.set('priority',1);
            return Song.save().then((newSong)=> {
                let {id,attributes}=newSong
                Object.assign(this.data,{ id, ...attributes })
            }, (error)=> {
                console.error(error);
            });
        },
        updata(data){
            var song = AV.Object.createWithoutData('Song',this.data.id);
                // 修改属性
                song.set('name', data.name);
                song.set('singer', data.singer);
                song.set('url', data.url);
                // 保存到云端
                return song.save().then((response)=>{
                    Object.assign(this.data,data)
                    return response
                })
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('new',(data)=>{
                if(this.model.data.id){
                    this.model.data={name:'',singer:'',url:'',id:''}
                }else{
                    Object.assign(this.model.data,data)
                }
                this.view.render(this.model.data)
            })
            window.eventHub.on('select',(data)=>{
                this.model.data=data
                this.view.render(this.model.data)
            })
        },
        create(){
            let needs='name singer url'.split(' ')
            let data={}
            needs.map((string)=>{
                data[string]=this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
            .then(()=>{
                this.view.reset()
                let string=JSON.stringify(this.model.data)
                let object=JSON.parse(string)
                window.eventHub.emit('create',object)
            })
        },
        updata(){
            let needs='name singer url'.split(' ')
            let data={}
            needs.map((string)=>{
                data[string]=this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.updata(data) 
                .then(()=>{
                    let string=JSON.stringify(this.model.data)
                    let object=JSON.parse(string)
                    window.eventHub.emit('updata',object)
                })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                if(this.model.data.id){
                    this.updata()
                }else{
                    this.create()
                }
            })
        }
    }
    controller.init(view,model)
}