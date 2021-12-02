# vue风格规范

# 1.单组件如何命名

## 单文件组件的文件名的大小写

&ensp;&ensp;&ensp;&ensp;单文件组件的文件名应该始终是单词首字母大写（PascalCase），或者始终是横线连接的（kebab-case）。

&ensp;&ensp;&ensp;&ensp;单词首字母大写对于编辑器的自动补全最为友好，因为这会使JS(X)和模板中引用组件的方式尽可能一致，然而，混用文件的命名方式有时候会导致文件系统对大小写不敏感的问题，这也是横线连接命名可取的原因。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
components/
| - mycomponent.vue
components/
| - myComponent.vue
```



&ensp;&ensp;&ensp;&ensp;**好的例子：** 

```JavaScript
components/
| - MyComponent.vue
components/
| - my-component.vue
```


## 基础组件名

&ensp;&ensp;&ensp;&ensp;应用特定样式和约定的基础组件（也就是展示类的、无逻辑的或无状态的组件）应该全部以一个特定的前缀开头，比如Base、App或V。这些组件可以为你的应用奠定一致的基础样式和行为。它们可能只包括：

&ensp;&ensp;&ensp;&ensp;- HTML元素

&ensp;&ensp;&ensp;&ensp;- 其他基础组件

&ensp;&ensp;&ensp;&ensp;- 第三方UI组件库

&ensp;&ensp;&ensp;&ensp;它们绝不会包括全局状态（比如来自vuex store）

&ensp;&ensp;&ensp;&ensp;它们的名字通常包含所包裹元素的名字（比如BaseButton、BaseTable），除非没有现成的对应功能的元素（比如BaseIcon）。如果你为特定的上下文构建类似的组件，那么它们几乎总会消费这些组件（比如BaseButton可能会用在ButtonSubmit上）。

&ensp;&ensp;&ensp;&ensp;这样做的几个好处如下：

&ensp;&ensp;&ensp;&ensp;- 当你在编辑器中以字母顺序排序时，应用的基础组件会全部列在一起，这样更容易识别。

&ensp;&ensp;&ensp;&ensp;- 因为组件名应该始终是多个单词，所以这样做可以避免你在包裹简单组件时随意选择前缀（比如MyButton和VueButton）。

&ensp;&ensp;&ensp;&ensp;- 因为这些组件会被频繁使用，所以你可能想把它们放在全局而不是在各处分别导入它们。使用相同的前缀可以让webpack这样工作：

```JavaScript
var requireComponent = require.context("./src",true,/^Base[A-Z]/)
requireComponent.keys().forEach(function(fileName){
    var baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    var baseComponentName = baseComponentConfig.name || (
        fileName.replace(/^.+\//,'').replace(/\.\w+$/,'')
    )
    Vue.component(baseComponentName,baseComponentConfig)
})
```



&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```



&ensp;&ensp;&ensp;&ensp;**好的例子：** 

```JavaScript
components/
| - BaseButton.vue
| - BaseTable.vue
| - BaseIcon.vue
components/
| - AppButton.vue
| - AppTable.vue
| - AppIcon.vue
components/
| - VButton.vue
| - VTable.vue
| - VIcon.vue

```


## 单例组件名

&ensp;&ensp;&ensp;&ensp;只拥有单个活跃实例的组件以The前缀命名，以示其唯一性。但这并不意味着组件只可用于一个单页面，而是每个页面只使用一次。这些组件永远不接受任何prop，因为它们是为你的应用定制的，而不是应用中的上下文如果你发现有必要添加prop，就表明这实际上是一个可复用的组件，只是目前在每个页面只使用一次。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
components/
| - Heading.vue
| - MySidebar.vue
```



&ensp;&ensp;&ensp;&ensp;**好的例子：** 

```JavaScript
components/
| - TheHeading.vue
| - TheSidebar.vue
```


## 紧密耦合的组件名

&ensp;&ensp;&ensp;&ensp;和父组件紧密耦合的子组件应该以父组件名为前缀命名。

&ensp;&ensp;&ensp;&ensp;如果一个组件只在某个父组件的场景下有意义，那么这层关系应该体现在其名字上。编辑器通常会按字母顺序组织文件，这样做可以把相关联的文件排在一起。

&ensp;&ensp;&ensp;&ensp;通常，我们可以通过在父组件命名的目录中嵌套子组件以解决这个问题，比如：

```JavaScript
coomponents/
｜ - TodoList
    | - Item/
        | - index.vue
        | - Button.vue
    | - index.vue
```



&ensp;&ensp;&ensp;&ensp;或者：

```JavaScript
components/
| - TodoList/
    | - Item/
        | - index.vue
    | - Item.vue
| - TodoList.vue
```



&ensp;&ensp;&ensp;&ensp;但是我们并不推荐这种方式，因为这会导致：

&ensp;&ensp;&ensp;&ensp;- 许多文件的名字相同，这使得在编辑器中快速切换文件变得困难。

&ensp;&ensp;&ensp;&ensp;- 过多嵌套的子目录增加了在编辑器侧边栏中浏览组件所花的时间。

&ensp;&ensp;&ensp;&ensp;**更推荐的例子：** 

```JavaScript
components/
| - TodoList.vue
| - TodoListItem.vue
| - TodoListItemButton.vue
components/
| - SearchSidebar.vue
| - SearchSidebarNavigation.vue
```



&ensp;&ensp;&ensp;&ensp;**非常不好的例子** ：

```JavaScript
components/
| - TodoList.vue
| - TodoItem.vue
| - TodoButton.vue
components/
| - SearchSidebar.vue
| - NavigationForSearchSidebar.vue
```


## 组件名中的单词顺序

&ensp;&ensp;&ensp;&ensp;组件名应该以高级别的（通常是一般化描述的）单词开头，以描述性的修饰词结尾。

&ensp;&ensp;&ensp;&ensp;在应用中所谓的“高级别”，是跟语境有关的。比如对于一个带搜索表单的应用来说，它可能包含这样的组件：

```JavaScript
components/
| - ClearSearchButton.vue
| - ExcludeFromSearchInput.vue
| - LaunchOnStartupCheckbox.vue
| - RunSearchButton.vue
| - SearchInput.vue
| - TermsCheckbox.vue
```



&ensp;&ensp;&ensp;&ensp;你可能注意到了，我们很难看出来哪些组件是针对搜索的。现在根据规则给组件重新命名：

```JavaScript
components/
| - SearchButtonClear.vue
| - SearchButtonRun.vue
| - SearchInputExcludeGlob.vue
| - SearchInputQuery.vue
| - SettingsCheckboxLaunchOnStartup.vue
| - SettingsCheckboxTerms.vue
```



&ensp;&ensp;&ensp;&ensp;因为编辑器通常会按字母顺序组织文件，所以现在组件之间的重要关系一目了然了。

&ensp;&ensp;&ensp;&ensp;你可能想换成多几目录的方式，把所有的搜索组件放到search目录，把所有的设置组件放到settings目录。vue官方推荐只有在非常大型（如有100+个组件）的应用下才考虑这么做，原因有以下几点。

&ensp;&ensp;&ensp;&ensp;- 在多级目录间找来找去比在单个components目录下滚动查找花费更多的精力。

&ensp;&ensp;&ensp;&ensp;- 存在组件重名的时候（比如存在多个ButtonDelele组件），在编辑器里更难快速定位。

&ensp;&ensp;&ensp;&ensp;- 让重构变得更难，因为为一个移动了的组件更新相关引用时，查找或替换通常并不高效。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 


```JavaScript
components/
| - ClearSearchButton.vue
| - ExcludeFromSearchInput.vue
| - LaunchOnStartupCheckbox.vue
| - RunSearchButton.vue
| - SearchInput.vue
| - TermsCheckbox.vue
```



&ensp;&ensp;&ensp;&ensp;**好的例子：** 

```JavaScript
| - SearchButtonClear.vue
| - SearchButtonRun.vue
| - SearchInputExcludeGlob.vue
| - SearchInputQuery.vue
| - SettingsCheckboxLaunchOnStartup.vue
| - SettingsCheckboxTerms.vue
```


## 完整单词的组件名

&ensp;&ensp;&ensp;&ensp;组件名应该倾向完整单词而不是缩写。编辑器中的自动补全已经让书写长命名的代价非常低了，而它带来的明确性却是非常宝贵的。尤其应该避免不常用的缩写。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
components/
| - SdSettings.vue
| - UProfOpts.vue
```



&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
components/
| - StudentDashboardSettings.vue
| - UserProfileOptions.vue
```


## 组件名为多个单词

&ensp;&ensp;&ensp;&ensp;组件名应该始终由多个单词组成，但是根组件App除外。这样做可以避免与现有的以及未来的HTML元素相冲突，因为所有的HTML元素名称都是单个单词的。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
Vue.component('todo',{
    // ······
})

export default {
    name:'Todo',
    // ······
}
```



&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
Vue.component('todo-item',{
    // ······
})

export default {
    name:'TodoItem',
    // ······
}
```


## 模板中的组件名大小写

&ensp;&ensp;&ensp;&ensp;对于绝大多数项目来说，在单文件组件和字符串模板中的组件名应该总是单词首字母大写，但是在DOM模板中总是横线连接的。

&ensp;&ensp;&ensp;&ensp;> DOM模板指的是那些从DOM中取出来的模板。例如，在template选项中设置选择符，template的值如果以#开头，则它将用作选择符，并使用匹配元素的innerHTML做为模板。当render函数和template属性不存在时，el属性对应的挂载DOM元素的HTML会被提取出来用作模板。


&ensp;&ensp;&ensp;&ensp;单词首字母大写比横线连接有如下优势：

&ensp;&ensp;&ensp;&ensp;- 编辑器可以在模板里自动补全组件名，因为单词首字母大写同样适用于js。

&ensp;&ensp;&ensp;&ensp;- 在视觉上，<MyComponent>比<my-component>更能够和单个单词的HTML元素区别开来，因为前者有两个大写字母，后者只有一个横线。

&ensp;&ensp;&ensp;&ensp;- 如果你在模板中使用任何非vue的自定义元素，比如一个Web Component，单词首字母大写确保了你的vue组件在视觉上仍然时易识别的。

&ensp;&ensp;&ensp;&ensp;不幸的是，如果你已经是横线连接的重度用户，那么与HTML保持一致且在多个项目中保持相同的大小写规则的命名约定就可能比上述优势更为重要。在这些情况下，在所有的地方都使用横线连接同样是可以接受的。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
<!-- 在单文件组件和字符串模板中 -->
<mycomponent/>

<!-- 在单文件组件和字符串模板中 -->
<myComponent/>

<!-- 在DOM模板中 -->
<MyComponent/></MyComponent>

```



&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
<!-- 在单文件组件和字符串模板中 -->
<MyComponent/>

<!-- 在DOM模板中 -->
<my-component><my-component/>

<!-- 在所有地方 -->
<my-component><my-component/>
```


## JS/JSX中的组件名大小写

&ensp;&ensp;&ensp;&ensp; JS/JSX中的组件名应该始终是单词首字母大写的。尽管在较为简单的应用中只使用vue.component进行全局组件注册时，可以使用横线连接字符串。

在javascript中，单词首字母大写是类和数据结构（本质上是任何可以产生多份不同实例的东西）的命名约定。vue组件也有多份实例，所以同样使用单词首字母大写是有意义的。额外的好处是，在jsx（和模板）里使用单词首字母大写能够让读者更容易分辨vue组件和HTML元素。

&ensp;&ensp;&ensp;&ensp;然而，对于通过vue.compoonent定义全局组件的应用来说，我们推荐使用横线连接的方式，原因有两点：

&ensp;&ensp;&ensp;&ensp;1. 全局组件很少被js引用，所以遵守js的命名约定意义不大。

&ensp;&ensp;&ensp;&ensp;2. 这些应用往往包含许多DOM内的模板，这种情况下必须使用横线连接的方式。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
Vue.component('myComponent',{
    // ······
})
import myComponent from './MyComponent.vue'
export default {
    name:'myComponent',
    // ······
}
export default {
    name:'my-component',
    // ······
}

```



&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
Vue.component('MyComponent',{
    // ······
})
Vue.component('my-component',{
    // ······
})
import MyComponent from './MyComponent.vue'
export default {
    name:'MyComponent',
    // ······
}
```


# 2.自闭合组件

&ensp;&ensp;&ensp;&ensp;在单文件组件、字符串模板和JSX中，没有内容的组件应该是自闭合的，但在DOM模板中永远不要这样做。

&ensp;&ensp;&ensp;&ensp;自闭合组件表示它们不仅没有内容，而且刻意没有内容，这就好像书上的一页白纸对比贴有“本页有意留白”标签的白纸。而且没有额外的闭合标签，你的代码也更简洁。

&ensp;&ensp;&ensp;&ensp;不幸的是HTML并不支持自闭合的自定义元素，只有官方的“空”元素。所以上述策略仅适用于，进入DOM之前vue的模板编译器能够触达的地方，然后再生成符合DOM规范的HTML。这也是不要在DOM模板中这样做的原因。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
<!-- 在单文件组件、字符串模板和JSX中 -->
<MyComponent><MyComponent/>

<!-- 在DOM模板中 -->
<my-component/>

```



&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
<!-- 在单文件组件、字符串模板和JSX中 -->
<MyComponent/>

<!-- 在DOM模板中 -->
<my-component></my-component>
```


# 3.prop名的大小写

&ensp;&ensp;&ensp;&ensp;在声明prop的时候，其命名应该始终使用驼峰式命名规则，而在模板和JSX中应该始终使用横线连接的方式。

&ensp;&ensp;&ensp;&ensp;这里我们遵守每个语言的约定，在js中更多使用驼峰式命名规则，而在HTML中则是横线连接的方式。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
props:{
    'greeting-text':String
}

<WelcomeMessage greetingText="hi"/>
```


&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
props:{
    'greetingText':String
}

<WelcomeMessage greeting-text="hi"/>
```


# 4.多个特性的元素

&ensp;&ensp;&ensp;&ensp;多个特性的元素应该分多行揣写，每个特性一行。在js中，用多行分割对象的多个属性是很常见的最佳实践的最佳实践，因为这更易读。模板和jsx值得我们做相同的考虑。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
<img src="https://www.baidu.com" alt="baidu">
<MyComponent foo="a" bar="b" baz="c"/>
```


&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
<img
  src="https://www.baidu.com"
  alt="baidu"
>
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```


# 5.模板中简单的表达式

&ensp;&ensp;&ensp;&ensp;组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。

&ensp;&ensp;&ensp;&ensp;复杂的表达式会让模板变得不是那么声明式。我们应该尽量描述理应出现的是什么，而非如何计算那个值。而且计算属性和方法使得代码可以重用。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
{{
  fullName.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
}}
```



&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
<!-- 在模板中 -->
{{ normailzedFullName }}

//复杂表达式已经移入一个计算属性
computed:{
  normalizedFullName(){
    return this.fullName.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
  }
}
```


# 6.简单的计算属性

&ensp;&ensp;&ensp;&ensp;应该把复杂的计算属性分隔为尽可能多更简单的属性。简单、命名得当的计算属性具有以下特点：

&ensp;&ensp;&ensp;&ensp;- 易于测试：当每个计算属性都包含一个非常简单且很少依赖的表达式，揣写测试以确保其正确工作会更加容易。

&ensp;&ensp;&ensp;&ensp;- 易于阅读：简化计算属性要求你为每一个值都起一个描述性的名称，即便它不可复用。这使得开发者更容易专注在代码上并搞清楚发生了什么。

&ensp;&ensp;&ensp;&ensp;- 更好地“拥抱变化”：任何能够命名的值都可能用在视图上。举个例子，我们可能打算展示一个信息，告诉用户它们存了多少钱；也可能打算计算税费，但是可能会分开展现，而不是作为总价的一部分。

&ensp;&ensp;&ensp;&ensp;较小的、专注的计算属性减少了信息使用时的假设性限制，所以需求变更时不需要那么多重构了。

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
computed:{
  price(){
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (basePrice - basePrice * (this.discountPercent || 0))
  }
}
```


&ensp;&ensp;&ensp;&ensp;

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
computed:{
  basePrice(){
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount(){
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice(){
    return this.basePrice - this.discount
  }
}
```


# 7.指令缩写

&ensp;&ensp;&ensp;&ensp;指令缩写（用“:”表示v-bind，用“@”表示v-on）要保持统一。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
<input 
    v-bind:value="newTodoText"
    :placeholder="newTodoInstructions"
>
<input 
    v-on:input="onInput"
    @focus="onFocus"
>

```



&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
<input 
    :value="newTodoText"
    :placeholder="newTodoInstructions"
>
<input 
    v-bind:value="newTodoText"
    v-bind:placeholder="newTodoInstructions"
>
<input 
    @input="onInput"
    @focus="onFocus"
>

<input 
    v-on:input="onInput"
    v-on:focus="onFocus"
>

```


# 8.良好的代码顺序

## 组件/实例的选项顺序

&ensp;&ensp;&ensp;&ensp;组件/实例的选项应该有统一的顺序。下面是vue官方推荐的组件选项默认顺序，它们被划分为几大类，从中能知道从插件里添加的新属性应该放到哪里。

&ensp;&ensp;&ensp;&ensp;**副作用（触发组件外的影响）** 

&ensp;&ensp;&ensp;&ensp;- el

&ensp;&ensp;&ensp;&ensp;**全局感知（要求组件以外的知识）** 

&ensp;&ensp;&ensp;&ensp;- name

&ensp;&ensp;&ensp;&ensp;- parent

&ensp;&ensp;&ensp;&ensp;**组件类型（更改组件的类型）** 

&ensp;&ensp;&ensp;&ensp;- functional

&ensp;&ensp;&ensp;&ensp;**模板修改器（改变模板的编译方式）** 

&ensp;&ensp;&ensp;&ensp;- delimiters

&ensp;&ensp;&ensp;&ensp;- comments

&ensp;&ensp;&ensp;&ensp;**模板依赖（模板内使用的资源）** 

&ensp;&ensp;&ensp;&ensp;- components

&ensp;&ensp;&ensp;&ensp;- directives

&ensp;&ensp;&ensp;&ensp;- filters

&ensp;&ensp;&ensp;&ensp;**组合（向选项里合并属性）** 

&ensp;&ensp;&ensp;&ensp;- extends

&ensp;&ensp;&ensp;&ensp;- mixins

&ensp;&ensp;&ensp;&ensp;**接口（组件的接口）** 

&ensp;&ensp;&ensp;&ensp;- inheritAttrs

&ensp;&ensp;&ensp;&ensp;- model

&ensp;&ensp;&ensp;&ensp;- props/propsData

&ensp;&ensp;&ensp;&ensp;**本地状态（本地的响应式属性）** 

&ensp;&ensp;&ensp;&ensp;- data

&ensp;&ensp;&ensp;&ensp;- computed

&ensp;&ensp;&ensp;&ensp;**事件（通过响应式事件触发的回调）** 

&ensp;&ensp;&ensp;&ensp;- watch

&ensp;&ensp;&ensp;&ensp;- 生命周期钩子（按照它们被调用的顺序）

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- beforeCreate

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- created

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- beforeMount

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- mounted

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- beforeUpdate

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- updated

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- activated

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- deactivated

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;-  beforeDestroy

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;- destroyed

&ensp;&ensp;&ensp;&ensp;**非响应式的属性（不依赖响应式系统的实例属性）** 

&ensp;&ensp;&ensp;&ensp;- methods

&ensp;&ensp;&ensp;&ensp;**渲染（组件输出的声明式描述）** 

&ensp;&ensp;&ensp;&ensp;- template/render

&ensp;&ensp;&ensp;&ensp;- renderError

## 元素特性的顺序

&ensp;&ensp;&ensp;&ensp;元素（包括组件）的特性应该有统一的顺序。下面是vue官方为元素特性推荐的默认顺序，它们被划分为几大类，从中也能知道新添加的自定义特性和指令应该放到哪里。

**定义（提供组件的选项）** 

- is

**列表渲染（创建多个变化的相同元素）** 

- v-for

**条件渲染（元素是否渲染/显示）** 

- v-if

- v-else-if

- v-else

- v-show

- v-cloak

**渲染方式（改变元素的渲染方式）** 

- v-pre

- v-once

**全局感知（需要超越组件的知识）** 

- id

**唯一的特性（需要唯一值的特性）** 

- ref

- key

- slot

**双向绑定（把绑定和事件结合起来）** 

- v-model

**其他特性（所有普通的绑定或未绑定的特性）** 

**事件（组件事件监听器）** 

- v-on

**内容（覆写元素的内容）** 

- v-html

- v-text

## 单文件组件顶级元素的顺序

&ensp;&ensp;&ensp;&ensp;单文件组件应该总是让<script>、<template>和<style>标签的顺序保持一致，且<style>要放在最后面，因为另外两个标签至少要有一个。

&ensp;&ensp;&ensp;&ensp;**不好的例子：** 

```JavaScript
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>

<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>/...</template>
<script>/* ... */</script>
<style>/* ... */</style>

```


&ensp;&ensp;&ensp;&ensp;各个组件之间的顶级元素顺序应该保持一致。

&ensp;&ensp;&ensp;&ensp;**推荐的例子：** 

```JavaScript
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

```



