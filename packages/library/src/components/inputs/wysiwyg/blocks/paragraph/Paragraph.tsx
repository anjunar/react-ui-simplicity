import "./Paragraph.css"
import React, {FormEvent, useEffect, useState} from "react"
import {ParagraphNode, TextBlock} from "./ParagraphNode";

function Paragraph(properties: Paragraph.Attributes) {

    const {node, ref, ...rest} = properties

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

    return (
        <div className={"paragraph"} ref={ref} contentEditable={true} dangerouslySetInnerHTML={{__html : text}} onBlur={onChange} {...rest}></div>
    )
}

namespace Paragraph {
    export interface Attributes {
        node : ParagraphNode
        ref : React.RefObject<HTMLDivElement>
    }
}

export default Paragraph