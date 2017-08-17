import React, { Component } from 'react'
import './styleEditor.css'
import Prism from 'prismjs'

class StyleEditor extends Component {
    constructor(props) {
        super(props)
        this.container = null
        this.state = {
            a: ''
        }
    }
    generateCodeInStyle = () => {
        return `<style>${this.props.code}</style>`
    }
    generateHightlightCode = () => {
        return Prism.highlight(this.props.code, Prism.languages.css)
    }
    goBottom = () => {
        this.container.scrollTop = 1000000
    }
    componentWillMount() {
        // console.log(this.props)
    }
    render() {
        return (
            <div className="style_editor" ref={el => this.container = el}>
                <div className="code" dangerouslySetInnerHTML={{__html: this.generateCodeInStyle()}} />
                <pre dangerouslySetInnerHTML={{__html: this.generateHightlightCode()}} />
            </div>
        )
    }
}

export default StyleEditor