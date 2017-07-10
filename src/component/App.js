import React, { Component } from 'react'
import './style/reset.css'
import './style/app.css'
import StyleEditor from './StyleEditor/StyleEditor'
import MarkDownEditor from './MarkdownEditor/MarkDownEditor'

class App extends Component {
    constructor() {
        super()
        this.state = {
            interval: 50,
            currentStyle: '',
            enableHtml: false,
            fullStyle: [
                `/*
* Inspired by http://strml.net/
* 参考于 https://jirengu-inc.github.io/animating-resume/dist/
* 大家好，我是ShowTime
* 一个编程路上的小学生。
* 今天我们来写一份酷炫的简历吧
*/

/* 首先给所有元素加上过渡效果 */
* {
  -webkit-transition: all 1s;
  transition: all 1s;
}
/* 白色背景太单调了，我们来点背景 */
html {
    color: rgb(222,222,222);
    background: rgb(63, 82, 99);
}
/* 文字离边框太近了 */
.style_editor {
    padding: .5em;
    border: 1px solid;
    margin: .5em;
    overflow: auto;
    width: 49%;
    max-height: 94.5%;
    box-shadow: 4px 4px 2px 0 rgba(0,0,0,0.3);
}
/* 代码高亮 */
.token.selector{ color: #E69F0F; }
.token.property{ color: #64D5EA; }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }

/* 加点 3D 效果呗 */
html{
  -webkit-perspective: 1000px;
          perspective: 1000px;
}
.style_editor {
    position: absolute;
    left: 0;
    top: 0;
    -webkit-transform: translateX(98.5%) translateZ(-100px) rotateY(-10deg);
            transform: translateX(98.5%) translateZ(-100px) rotateY(-10deg);
    -webkit-transform-origin: right;
            transform-origin: right;
    max-height: 94.5%;
}

/* 接下来我给自己准备一个编辑器 */
.mark_down_editor{
    position: absolute;
    left: 0;
    top: -100%;
    padding: .5em;
    margin: .5em;
    border: 1px solid;
    color: #ddd;
    overflow: auto;
}
.mark_down_editor{
    width: 49%;
    height: 95%;
    top: 0;
    -webkit-transform: rotateY(10deg) translateZ(-100px);
            transform: rotateY(10deg) translateZ(-100px);
    -webkit-transform-origin: left;
            transform-origin: left;
}
/* 好了，我开始写简历了 */


`,
                `
/* 这个简历好像差点什么
 * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
 * 简单，用开源工具翻译成 HTML 就行了
 */
`
                ,
                `
/* 再对 HTML 加点样式 */
.mark_down_editor{
    padding: 2em;
}
.mark_down_editor h2{
    display: inline-block;
    border-bottom: 1px solid;
    margin: 1em 0 .5em;
}
.mark_down_editor ul,.mark_down_editor ol{
    list-style: none;
}
.mark_down_editor ul> li::before{
    content: '•';
    margin-right: .5em;
}
.mark_down_editor ol {
    counter-reset: section;
}
.mark_down_editor ol li::before {
    counter-increment: section;            
    content: counters(section, ".") " ";  
    margin-right: .5em;
}
.mark_down_editor blockquote {
    margin: 1em;
    padding: .5em;
    background: #ddd;
}
`],
            currentMarkdown: '',
            fullMarkdown: `showTime
----

一个代码爱好者，目前是一名前端工程师

技能
----

* JS
* Vue.js
* React.js
* Node.js 努力学习中
* Java 努力学习中

兴趣爱好
----

1. 打游戏
2. 写代码
3. 做梦

链接
----

* [GitHub](https://github.com/FrozenByzz)

说明
----

* 如果你喜欢这个效果，可以下载改写
* 原作者是用vue写的，这是我改成react版的
* 代码思路并没有作任何改动，只是vue和react语法上的差异

`
        }
    }
    componentDidMount() {
        this.makeResume();
    }
    makeResume = async () => {
        /*
            这里await需要配合Promise来执行，await会等待上一个函数执行完毕再执行下一个await
            而每一个函数都是定时器，resolve就是promise执行完毕，不懂可以看看es6
        */
        await this.progressivelyShowStyle(0)
        await this.progressivelyShowResume()
        await this.showHtml()
        await this.progressivelyShowStyle(1)
        await this.progressivelyShowStyle(2)
        // await 
    }
    showHtml() {
        return new Promise((resolve, reject) => {
            this.setState({
                enableHtml: true
            })
            resolve()
        })
    }
    progressivelyShowStyle(number) {
        return new Promise((resolve, reject) => {
            let interval = this.state.interval
            let showStyle = (async function () {
                // 首先传入的是需要显示哪一段文字，如果在数组中下标越界，就return
                let style = this.state.fullStyle[number]
                if (!style) { return }
                // 这个长度是计算当前传入的number，在数组中这个下标之前的所有文字的长度
                let length = this.state.fullStyle.filter((_, index) => index <= number).map((item) => item.length).reduce((p, c) => p + c, 0)
                // 这个长度是当前下标之前的数组中所有字符的长度，当number进来时，currentStyle开始位置：总长度减去之前有的元素，因为需要判断这个函数什么时候结束
                // 结束的时机就是长度到下标之前所有字符的长度
                let prefixLength = length - style.length
                if (this.state.currentStyle.length < length) {
                    let l = this.state.currentStyle.length - prefixLength
                    let char = style.substring(l, l + 1) || ' '
                    this.setState((prev, next) => {
                        return {
                            currentStyle: prev.currentStyle+=char
                        }
                    })
                    if (style.substring(l - 1, l) === '\n' && this.refs.styleEditor) {
                        this.refs.styleEditor.goBottom()
                    }
                    setTimeout(showStyle, interval)
                } else {
                    resolve()
                }
            }).bind(this)
            showStyle()
        })
    }
    progressivelyShowResume() {
        return new Promise((resolve, reject) => {
            let length = this.state.fullMarkdown.length
            let interval = this.state.interval
            let showResume = async () => {
                if (this.state.currentMarkdown.length < length) {
                    await this.setState((prev, props) => {
                        return {
                            currentMarkdown: prev.fullMarkdown.substring(0, prev.currentMarkdown.length+1)
                        }
                    })
                    let prevChar = this.state.currentMarkdown[this.state.currentMarkdown.length - 2]
                    if (prevChar === '\n' && this.refs.markdownEditor) {
                        this.refs.markdownEditor.goBottom()
                    }
                    setTimeout(showResume, interval);
                } else {
                    resolve()
                }
            }
            showResume()
        })
    }
    render() {
        return (
            <div id="app">
                <StyleEditor code={this.state.currentStyle} ref="styleEditor" />
                <MarkDownEditor markdown={this.state.currentMarkdown} enableHtml={this.state.enableHtml} ref="markdownEditor" />
            </div>
        )
    }
}

export default App