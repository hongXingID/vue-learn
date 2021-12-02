# vue最佳实践

# 1.为列表渲染设置属性key

&ensp;&ensp;&ensp;&ensp;key这个特殊属性主要用在vue.js的虚拟DOM算法中，在对比新旧虚拟节点时辨识虚拟节点。

&ensp;&ensp;&ensp;&ensp;在更新节点时，需要从旧的虚拟节点列表中查找与新的虚拟节点进行更新。如果这个查找过程设置了属性key，那么查找速度会快很多，所以无论如何，即在使用v-for时提供key属性，除非遍历输出的DOM内容非常简单，或者是可以依赖默认行为以获取性能上的提升。

```JavaScript
<div v-for="item in items" :key="item.id" >
     <!-- 内容 -->
</div>
```


# 2.在v-if/v-if-else/v-else中使用key

&ensp;&ensp;&ensp;&ensp;如果一组v-if + v-else的元素类型相同，最好使用属性key（比如两个div元素）

&ensp;&ensp;&ensp;&ensp;v-if指令在编译后大致是下面的样子：

```JavaScript
（has）? _c('li',[_v("if")]) : _c('li',[_v("else")])
```



&ensp;&ensp;&ensp;&ensp;所以当状态发生变化的时候，生成的虚拟节点既有可能是v-if上的虚拟节点，也有可能是v-else上的虚拟节点，默认情况下，Vue.js会尽可能高效地更新DOM，这意味着，当它在相同类型的元素之间切换时，会修补已存在的元素，而不是将旧的元素移除，然后在同一个位置添加一个新的元素。如果本不相同的元素被识别为相同，则会出现意料之外的副作用。

&ensp;&ensp;&ensp;&ensp;如果添加属性key，那么在对比虚拟DOM时，则会认为它们时两个不同的节点，于是会将旧的元素移除并在相同的位置上添加一个新的元素，从而避免意料之外的副作用。

&ensp;&ensp;&ensp;&ensp;**不好的做法：** 

```JavaScript
<div v-if="status">
    <!-- 内容 -->
</div>

<div v-else>
    <!-- 内容 -->
</div>
```



&ensp;&ensp;&ensp;&ensp;**好的做法：** 

```JavaScript
 <div v-if="status" key="status1">
    <!-- 内容 -->
</div>

<div v-else key="status2">
    <!-- 内容 -->
</div>
```


# 3.关于路由切换组件不变的解决方案

&ensp;&ensp;&ensp;&ensp;**场景：** 

&ensp;&ensp;&ensp;&ensp;当页面切换到同一个路由但由不同参数的地址时，组件的生命周期钩子并不会重新触发。

&ensp;&ensp;&ensp;&ensp;**例如：** 

```JavaScript
const routes = [
    {
    path:'/detail/:id',
    name:'detail',
    component:Detail
    }
]
```



&ensp;&ensp;&ensp;&ensp;当我们从路由/detail/1切换到/detail/2时，组件时不会发生任何变化的。

&ensp;&ensp;&ensp;&ensp;这是因为vue-router会识别出两个路由使用的是同一个组件从而进行复用，并不会重新创建组件，因此组件的生命周期钩子自然不会被触发。

&ensp;&ensp;&ensp;&ensp;组件本质上是一个映射关系，所以先销毁再重建一个相同的组件会存在很大程度上的性能浪费，复用组件才是正确的选择。但是这也意味着组件的生命周期钩子不会再被调用。

## 路由导航守卫beforeRouteUpdate

&ensp;&ensp;&ensp;&ensp;vue-router提供了导航守卫beforeRouteUpdate，该守卫在当前路由改变且组件被复用时调用，所以可以在组件内定义路由导航守卫来解决这个问题。

&ensp;&ensp;&ensp;&ensp;组件的生命周期钩子虽然不会重新触发，但是路由提供的beforeRouteUpdate守卫可以被触发。因此，只需要把每次切换路由时需要执行的逻辑放到beforeRouteUpdate守卫中即可。例如，在beforeRouteUpdate守卫中发送请求拉取数据，更新状态并重新渲染视图。这种方式在vue-router2.2之后的版本可以使用。

## 观察$route对象的变化

&ensp;&ensp;&ensp;&ensp;通过watch可以监听到路由对象发生的变化，从而对路由变化作出相应。

&ensp;&ensp;&ensp;&ensp;**例如：** 

```JavaScript
const User = {
    template:'...',
    watch:{
        '$route'(to,from){
            //对路由变化作出响应
        }
    }
}
```



&ensp;&ensp;&ensp;&ensp;这种方式也可以解决上述问题，但代价是组件多了一个watch，这会带来依赖追踪的内存开销。

&ensp;&ensp;&ensp;&ensp;如果最终选择使用watch解决这个问题，那么在某些场景下更推荐在组件里观察自己需要的query，这样有利于减少不必要的请求。

&ensp;&ensp;&ensp;&ensp;假设有这样一个场景，页面中有两部分内容，上面是个人的描述信息，下面一个带翻页的列表，这是假设路由中的参数是/user?id=1&page=2时，说明用户id时1，列表是第二页。

&ensp;&ensp;&ensp;&ensp;我们可以断定每次翻页是只需要发送列表的请求，而个人的描述信息只需要第一次进入组件时请求一次即可。当翻到第二页时，路由应该是这样的：/user?id=1&page=2。

&ensp;&ensp;&ensp;&ensp;可以看到，参数中的id没有变化，只有page变了。所以为了避免发送多余的请求，应该这样去观察路由：

```JavaScript
const User = {
    template:'...',
    watch:{
        '$route.query.id'(){
            //请求个人描述信息
        },
        '$route.query.page'(){
            //请求列表
        }
    }
}
```



&ensp;&ensp;&ensp;&ensp;不好的做法是统一观察$route：

```JavaScript
const User = {
    template:'...',
    watch:{
        '$route'(to,from){
            //请求个人描述信息
            //请求列表
        }
    }
}
```


## 为router-view组件添加属性key

&ensp;&ensp;&ensp;&ensp;这种方法非常取巧，非常“暴力”，但也非常有效。它本质上是利用虚拟DOM在渲染时通过key来对比两个节点是否相同的原理。通过给router-view组件设置key，可以使每次切换路由时的key都不一样，让虚拟DOM认为router-view组件是一个新节点，从而先销毁组件，然后再重新创建新的组件，即使是相同的组件，但是如果url变了，key就变了，vue就会重新创建这个组件，

&ensp;&ensp;&ensp;&ensp;因为组件是新创建的，所以组件内的生命周期会重复触发。

&ensp;&ensp;&ensp;&ensp;例如：

```JavaScript
<router-view :key="$route.fullPath"></router-view>
```



&ensp;&ensp;&ensp;&ensp;这种方式的坏处很明显，每次切换路由组件时都会销毁并且重新创建，非常浪费性能。其优点更明显，简单粗暴，改动小。为router-view组件设置了key之后，立刻就可以看到问题被解决了。

# 4.为所有的路由统一添加query

&ensp;&ensp;&ensp;&ensp;如果路由上的query中有一些是从上游链路上传下来的，那么需要在应用的任何路由中携带，但是在所有跳转路由的地方都设置一遍会非常麻烦。例如，在应用中的所有路由上都加上参数：https://berwin.me/a?referer=hao360cn和https://berwin.me/b?referer=hao360cn。

&ensp;&ensp;&ensp;&ensp;理想状态是，在全局统一配置一个基础的query，它会在应用的所有路由中携带，并且不影响应用中各个路由的切换，也无须在切换路由时进行任何特殊处理。

&ensp;&ensp;&ensp;&ensp;遗憾的是，vue-router并没有提供相应的API来处理这种情况。下面提供两种方式来解决这个问题。

## 使用全局守卫beforeEach

&ensp;&ensp;&ensp;&ensp;事实上，全局守卫beforeEach并不具备修改query的能力，但可以在其中使用next方法来中断当前导航，并切换到新的导航，添加一些新的query进去。

&ensp;&ensp;&ensp;&ensp;当然，单单这样做会出问题，因为在进入新的导航后，依然会被全局守卫beforeEach拦截，然后再次开启新导航，从而导致无限循环。解决办法是在beforeEach中判断这个全局添加到参数在路由对象中是否存在，如果存在，则不开启新的导航。

```JavaScript
const query = {referer:'hao360cn'}
router.beforeEach((to,from,next)=>{
    to.query.referer ? next() : next({...to,query:{...to.query,...query}})
})
```



&ensp;&ensp;&ensp;&ensp;这种方式的优点是，可以全局统一配置公共的query参数，并且在组件内切换路由时无须进行特殊处理。缺点是每次切换路由时，全局守卫beforeEach会执行两次，即每次切换路由其实是切换两次。

## 使用函数劫持

&ensp;&ensp;&ensp;&ensp;原理：通过拦截router.history.transitionTo方法，在vue-router内部在切换路由之前将参数添加到query中。

```JavaScript
const query = {referer:'hao360cn'}
const transitionTo= router.history.transitionTo

router.history.transitionTo = function(location,onComplete,onAbort){
    location = type location === 'object' ? {...location,query:{...location.query,...query}} : {path:location,query}
    transitionTo.call(router.history,location,onComplete,onAbort)
}
```



&ensp;&ensp;&ensp;&ensp;代码中，先将vue-router内部的router.history.transitionTo方法缓存到变量transitionTo中，随后使用一个新的函数重写router.history.transitionTo方法，通过在函数中修改参数来达到全局添加query参数的目的。当执行缓存的原始方法时，将修改后的参数传递进去即可。

&ensp;&ensp;&ensp;&ensp;这种方式的优点是可以全局添加query参数并且不会导致路由切换两次。缺点是用过修改vue-router内部方法实现目的，这是一种危险的操作。

# 5.区分Vuex与props的使用边界

&ensp;&ensp;&ensp;&ensp;通常。在项目开发中，业务组件会使用Vuex维护状态，使用不用组件统一操作Vuex中的状态。这样不论是父子组件间的通信还是兄弟组件间的通信都很容易。

&ensp;&ensp;&ensp;&ensp;对于通用组件，可以使用props以及实际爱你进行父子组件间的通信（通用组件不需要兄弟组件间的通信）。这样做是因为通用组件会拿到各个业务组件中使用，它要与业务解耦，所以需要使用props获取状态。

&ensp;&ensp;&ensp;&ensp;通用组件要定义细致的prop，并且尽可能详细，至少需要指定其类型。这样做的好处是：

&ensp;&ensp;&ensp;&ensp;- 写明了组件的API，所以很容易看懂组件的用法。

&ensp;&ensp;&ensp;&ensp;- 在开发环境下，如果向一个组件提供格式不正确的prop，vue会在控制台发出警告，帮助我们捕获潜在的错误来源。

# 6.避免v-if和v-for一起使用

&ensp;&ensp;&ensp;&ensp;vue官方强烈建议不要把v-if和v-for同时用在同一个元素上。

&ensp;&ensp;&ensp;&ensp;通常，我们在下面两种常见的情况下，会倾向于不同的做法。

&ensp;&ensp;&ensp;&ensp;- 为了过滤一个列表中的项目（比如v-for="user in users" v-if="user.isActive"），请将user替换为一个计算属性（比如activeUsers），让它返回过滤后的列表。

&ensp;&ensp;&ensp;&ensp;- 为了避免渲染本应该被隐藏的列表（比如v-for="user in users" v-if="shouldShow-Users"），请将v-if移动至容器元素之上（比如ul和ol）。

&ensp;&ensp;&ensp;&ensp;对于第一种情况，vue官方给出的解释是：当vue处理指令时，v-for比v-if具有更高的优先级，所以即使我们只渲染出列表中的一小部分元素，也得在每次重渲染的时候遍历整个列表，而不考虑活跃用户是否发生了变化。通过将列表更换为在一个计算属性上遍历并过滤掉不需要渲染的数据，我们将会获得如下好处。

&ensp;&ensp;&ensp;&ensp;过滤后的列表只会在数组发生相关变化时才被重新运算，过滤更高效。

&ensp;&ensp;&ensp;&ensp;使用v-for="user in activeUsers"之后，我们在渲染时只遍历活跃用户，渲染更高效。

&ensp;&ensp;&ensp;&ensp;解耦渲染层的逻辑，可维护性（对逻辑的更改和拓展）更强

&ensp;&ensp;&ensp;&ensp;例如，下面这个模板：

```JavaScript
<ul>
    <li
        v-for="user in users"
        v-if="user.isActive"
        :key="user.id"
     >
        {{user.name}}
    </li>
</ul>
```



&ensp;&ensp;&ensp;&ensp;可以更换为在如下的一个计算属性上遍历并过滤列表：

```JavaScript
computed:{
    activeUsers(){
        return this.users.filter(user => user.isActive)
    }
}
```



&ensp;&ensp;&ensp;&ensp;模板更改为：

```JavaScript
<ul>
    <li
        v-for="user in activeUsers"
        :key="user.id"
     >
        {{user.name}}
    </li>
</ul>
```



&ensp;&ensp;&ensp;&ensp;对于第二种情况，官方的解释是为了获得同样的好处，可以把：

```JavaScript
<ul>
    <li
        v-for="user in users"
        v-if="shouldShowUsers"
        :key="user.id"
     >
        {{user.name}}
    </li>
</ul>
```



&ensp;&ensp;&ensp;&ensp;更新为：

```JavaScript
<ul v-if="shouldShowUsers">
    <li
        v-for="user in users"
        :key="user.id"
     >
        {{user.name}}
    </li>
</ul>
```



&ensp;&ensp;&ensp;&ensp;通过将v-if移动到容器元素，我们不会再检查每个用户的shouldShowUsers，取而代之的是，我们只检查它一次，且不会在shouldShowUsers为false的时候运算v-for。

# 7.为组件样式设置作用域

&ensp;&ensp;&ensp;&ensp;CSS的规则是全局的，任何一个组件的样式规则都对整个页面有效。因此，我们很容易在一个组件中写了某个样式，而不小心影响了另一个组件的样式，或者自己的组件被第三方库的CSS影响了。

&ensp;&ensp;&ensp;&ensp;对于应用来说，最佳实践是只有顶级App组件和布局组件中的样式可以是全局的，其他所有组件都应该是有作用域的。

&ensp;&ensp;&ensp;&ensp;在vue中，可以通过scope特性或CSS Modules来设置组件样式作用域。

&ensp;&ensp;&ensp;&ensp;对于组件库，我们应该更倾向于选用基于class的策略，而不是scope特性。因为基于class的策略使覆写内部样式更容易，它使用容易理解的class名称且没有太高的选择器优先级，不容易导致冲突。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
<template>
    <button>X</button>
</template>

<style>
.button{
    color:red;
}
</style>
```



&ensp;&ensp;&ensp;&ensp;**好的例子：** 

```JavaScript
<template>
    <button>X</button>
</template>

<style scoped>
.button{
    color:red;
}
</style>
```


# 8.避免在scoped中使用元素选择器

&ensp;&ensp;&ensp;&ensp;在scope样式中，类选择器比元素选择器更好，因为大量使用元素选择器是很慢的。

&ensp;&ensp;&ensp;&ensp;为了给样式设置作用域，vue会为元素添加一个独一无二的特性，例如data-v-f3f3eg9。然后修改选择器，使得在匹配选择器的元素中，只有带这个特性的才会真正生效（比如button[data-v-f3f3eg9]）

&ensp;&ensp;&ensp;&ensp;问题在于，大量的元素和特性组合的选择器（比如button[data-v-f3f3eg9]）会比类和特性组合的选择器慢，所以应尽可能选用类选择器。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
<template>
    <button>X</button>
</template>

<style scoped>
button{
    color:red;
}
</style>
```



&ensp;&ensp;&ensp;&ensp;**好的例子：** 

```JavaScript
<template>
    <button class="button">X</button>
</template>

<style scoped>
.button{
    color:red;
}
</style>
```


# 9.避免隐性的父子组件通信

&ensp;&ensp;&ensp;&ensp;我们应该优先通过prop和事件进行父子组件之间的通信，而不是使用this.$parent或改变prop。

&ensp;&ensp;&ensp;&ensp;一个理想的Vue应用是“prop向下传递，事件向上传递”。遵守这一约定会让你的组件更容易理解。然而，在一些边界情况下，prop的变更或this.$parent能够简化两个深度耦合的组件。

&ensp;&ensp;&ensp;&ensp;问题在于，这种做法在很多简单的场景下可能会更方便。但要注意，不要为了一时方便而牺牲数据流向的简易性。

