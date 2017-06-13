import React, { Component } from 'react'
import marked from 'marked'
import './markdownEditor.css'

class MarkDownEditor extends Component {
    constructor(props) {
        super(props)
    }
    goBottom() {
        this.refs.container.scrollTop = 100000
    }
    result() {
        return this.props.enableHtml ? marked(this.props.markdown) : this.props.markdown
    }
    render() {
        return (
            <div className={this.props.enableHtml ? 'mark_down_editor html_mode' : 'mark_down_editor'} ref="container">
                {this.props.enableHtml ?
                <div dangerouslySetInnerHTML={{__html: this.result()}} />
                :
                <pre>
                    {this.result()}
                </pre>
                }
            </div>
        )
    }
}

export default MarkDownEditor