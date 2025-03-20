import React, {useContext, useEffect, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";

function CodeTool(properties: CodeTool.Attributes) {

    const {node} = properties

    const [text, setText] = useState(node.children.map(node => node.text).join(""))

    const {ast : {triggerAST}} = useContext(EditorContext)

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // node.block.source = text
        triggerAST()
    }, [text]);

    return (
        <div style={{overflow : "auto", width : "200px"}}>
            <textarea ref={textareaRef} style={{width : "1200px", height : "200px", fontFamily: "monospace"}} spellCheck={false}
                      value={text}
                      onChange={event => setText(event.target.value)}>
            </textarea>
        </div>
    )
}

namespace CodeTool {
    export interface Attributes {
        node : CodeNode
    }
}

export default CodeTool