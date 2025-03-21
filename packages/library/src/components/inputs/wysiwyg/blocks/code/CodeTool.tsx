import React, {useContext, useEffect, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";

function CodeTool(properties: CodeTool.Attributes) {

    const {node} = properties

    const {ast : {triggerAST}} = useContext(EditorContext)

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div style={{overflow : "auto", width : "200px"}}>
        </div>
    )
}

namespace CodeTool {
    export interface Attributes {
        node : CodeNode
    }
}

export default CodeTool