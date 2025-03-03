import "./Paragraph.css"
import React, {CSSProperties, FormEvent, useContext, useEffect, useLayoutEffect, useRef, useState} from "react"
import {ParagraphNode, TextBlock} from "./ParagraphNode";
import {WysiwygContext} from "../../context/WysiwygContext";
import Editor from "../text/Editor";

function Paragraph(properties: Paragraph.Attributes) {

    const {node, style} = properties

    const {ast, providers, trigger} = useContext(WysiwygContext)

    const ref = useRef<HTMLDivElement>(null);

    return (
        <Editor node={node}/>
    )
}

namespace Paragraph {
    export interface Attributes {
        node : ParagraphNode
        style? : CSSProperties
    }
}

export default Paragraph