import "./Header.css"
import React, {CSSProperties, useContext, useEffect, useLayoutEffect, useRef, useState} from "react"
import {HeaderBlock, HeaderNode} from "./HeaderNode";
import {Context} from "../../context/Context";

function Header(properties: Header.Attributes) {

    const {node, style} = properties

    const [text, setText] = useState("")

    const {ast, providers, trigger} = useContext(Context)

    const ref = useRef<HTMLHeadingElement>(null);

    function onBlur(event: React.FocusEvent) {
        let target = event.target as HTMLDivElement;
        if (text !== target.innerHTML) {
            setText(target.innerHTML)
        }
    }

    useEffect(() => {
        node.data = new HeaderBlock(text)
    }, [text]);

    useEffect(() => {
        setText(node.data.text)
    }, [node]);

    useLayoutEffect(() => {
        ref.current.innerHTML = text
        node.dom = ref.current
    }, [node.data?.level]);

    useEffect(() => {
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


    const CustomTag = node.data?.level || "h1" as React.ElementType

    return (
        <CustomTag ref={ref} className={"header"} contentEditable={true} onBlur={onBlur} style={style}></CustomTag>
    )
}

namespace Header {
    export interface Attributes {
        node: HeaderNode
        style? : CSSProperties
    }
}

export default Header