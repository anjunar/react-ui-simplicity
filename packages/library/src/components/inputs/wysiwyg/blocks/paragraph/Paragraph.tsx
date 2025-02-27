import "./Paragraph.css"
import React, {CSSProperties, FormEvent, useContext, useEffect, useLayoutEffect, useRef, useState} from "react"
import {ParagraphNode, TextBlock} from "./ParagraphNode";
import {Context} from "../../context/Context";

function Paragraph(properties: Paragraph.Attributes) {

    const {node, style} = properties

    const [text, setText] = useState("<p><span><br/></span></p>")

    const {ast, providers, trigger} = useContext(Context)

    const ref = useRef<HTMLDivElement>(null);

    function onBlur(event : React.FocusEvent<HTMLDivElement>) {
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
        node.dom = ref.current

        let listener = () => {
            let selection = window.getSelection();
            node.selected = node.dom.contains(selection.anchorNode)
            trigger()
        };

        document.addEventListener("selectionchange", listener)

        return () => {
            document.removeEventListener("selectionchange", listener)
        }
    }, []);

    return (
        <div className={"paragraph"} ref={ref} contentEditable={true} onBlur={onBlur} style={style}></div>
    )
}

namespace Paragraph {
    export interface Attributes {
        node : ParagraphNode
        style? : CSSProperties
    }
}

export default Paragraph