{
    let view={
        el:'.page > main',
        init(){
            this.$el=$(this.el)
        },
        template:`
        <h1>新建歌曲</h1>
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
            placeholder.map((string)=>{
                html=html.replace(`___${string}___`,data[string]||'')
            })
            $(this.el).html(html)
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
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                this.reset(data)
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
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
            })
        },
        reset(data){
            this.model.data=data
            this.view.render(this.model.data)
        }
    }
    controller.init(view,model)
}