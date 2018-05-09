{
    let view={
        el:'.page-1',
        init(){
            this.$el=$(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model={

    } 
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEvents()
            this.bindEventHub()
            this.loadModule1()
            this.loadModule2()
        },
        bindEvents(){

        },
        bindEventHub(){
            window.eventHub.on('tabSelect',(tabName)=>{
                if(tabName==='page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        loadModule1(){
            let script1=document.createElement('script')
            script1.src='./js/index/page-1-1.js' //相对于html
            script1.onload=()=>{
                console.log('加载模块1成功')
            }
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script2=document.createElement('script')
            script2.src='./js/index/page-1-2.js' //相对于html
            script2.onload=()=>{
                console.log('加载模块2成功')
            }
            document.body.appendChild(script2)
        }
    }
    controller.init(view,model)
}