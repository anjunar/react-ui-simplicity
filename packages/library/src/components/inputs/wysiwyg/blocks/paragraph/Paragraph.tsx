import "./Paragraph.css"
import React, {CSSProperties, FormEvent, useContext, useEffect, useLayoutEffect, useRef, useState} from "react"
import {ParagraphNode, TextBlock} from "./ParagraphNode";
import {Context} from "../../context/Context";

function Paragraph(properties: Paragraph.Attributes) {

    const {node, style} = properties

    const [text, setText] = useState("")

    const {ast, providers, trigger} = useContext(Context)

    const ref = useRef<HTMLDivElement>(null);

    function onFocus() {
        node.selected = true

        trigger()
    }


    function onBlur(event : React.FocusEvent<HTMLDivElement>) {
        let target = event.target as HTMLDivElement;
        if (text !== target.innerHTML) {
            setText(target.innerHTML)
        }
        setTimeout(() => {
            node.selected = false
            trigger()
        }, 200)
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
        <div className={"paragraph"} ref={ref} contentEditable={true} onBlur={onBlur} onFocus={onFocus} style={style}></div>
    )
}

namespace Paragraph {
    export interface Attributes {
        node : ParagraphNode
        style? : CSSProperties
    }
}

export default Paragraph