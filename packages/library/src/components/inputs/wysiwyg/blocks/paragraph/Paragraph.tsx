import "./Paragraph.css"
import React, {CSSProperties, FormEvent, useContext, useEffect, useLayoutEffect, useRef, useState} from "react"
import {ParagraphNode, TextBlock} from "./ParagraphNode";
import {Context} from "../../context/Context";
import TextEditor from "../text/TextEditor";

function Paragraph(properties: Paragraph.Attributes) {

    const {node, style} = properties

    const {ast, providers, trigger} = useContext(Context)

    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {

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
        <TextEditor ref={ref} node={node}/>
    )
}

namespace Paragraph {
    export interface Attributes {
        node : ParagraphNode
        style? : CSSProperties
    }
}

export default Paragraph