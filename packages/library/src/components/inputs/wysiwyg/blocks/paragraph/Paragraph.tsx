import "./Paragraph.css"
import React, {CSSProperties, FormEvent, useEffect, useLayoutEffect, useState} from "react"
import {ParagraphNode, TextBlock} from "./ParagraphNode";

function Paragraph(properties: Paragraph.Attributes) {

    const {node, ref, style} = properties

    const [text, setText] = useState("")

    function onChange(event : React.FocusEvent<HTMLDivElement>) {
        let target = event.target as HTMLDivElement;
        if (text !== target.innerHTML) {
            setText(target.innerHTML)
        }
    }

    useEffect(() => {
        node.data = new TextBlock(text)
    }, [text]);

    useEffect(() => {
        setText(node.data.text)
    }, [node]);

    useLayoutEffect(() => {
        ref.current.innerHTML = text
    }, []);

    return (
        <div className={"paragraph"} ref={ref} contentEditable={true} onBlur={onChange} style={style}></div>
    )
}

namespace Paragraph {
    export interface Attributes {
        node : ParagraphNode
        ref : React.RefObject<HTMLDivElement>
        style? : CSSProperties
    }
}

export default Paragraph