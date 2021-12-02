// vue2的响应式原理

import Dep from "./untils/dep"

//追踪变化
function defineReactive(data,key,val){
    let dep = new Dep();   //存储收集的依赖
 Object.defineProperty(data,key,{
     enumerable:true,
     configurable:true,
    //  收集依赖
     get(val){
         dep.depend()    //收集依赖
         return val;
     },
    //  分发依赖
     set(newVal){
         if(val === newVal){
             return;
         }
         val = newVal
         dep.notify()  //派发更新
     }
 })
}
var obj = {
    a:1
}

defineReactive(obj,'a')
obj.a=2