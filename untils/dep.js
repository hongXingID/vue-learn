function remove(arr,item){
    const index = arr.indexOf(item)
    if(index > -1){
       return arr.splice(index,1)
    }
}

export default class Dep{
    constructor(){
        this.subs = [];
    }
    addSub(sub){
        this.subs.push(sub)
    }
    // 删除依赖
    remove(sub){
        remove(this.subs,sub)
    }
    // 收集依赖
    depend(){
        if(window.target){
            this.addSub(window.target)
        }
    }
    // 派发更新
    notify(){
        const subs = this.subs.slice()
        for(let i =0,l = subs.length;i<l;i++){
            subs[i].update()
        }
    }
}