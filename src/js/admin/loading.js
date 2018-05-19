{
    let view={
        el:'#siteLoading',
        show(num){
            $(this.el).children(".loading").css("width", num);
        }
    }
    let controller={
        init(view){
            this.view=view
            this.bindEventHub()
            
        },
        bindEventHub(){
            window.eventHub.on('onUpload',(percent)=>{
                var num=parseFloat(percent)*100+'%'
                this.view.show(num)
            })
            window.eventHub.on('afterUpload',()=>{
                alert('上传成功')
            })
        }
    }
    controller.init(view)
}