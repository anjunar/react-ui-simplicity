import "./Header.css"
import React, {CSSProperties, useEffect, useLayoutEffect, useState} from "react"
import {HeaderBlock, HeaderNode} from "./HeaderNode";

function Header(properties: Header.Attributes) {

    const {node, ref, style} = properties

    const [text, setText] = useState("")

    function onChange(event: React.FocusEvent) {
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
    }, []);

    return (
        <h1 className={"header"} ref={ref} contentEditable={true} onBlur={onChange} style={style}></h1>
    )
}

namespace Header {
    export interface Attributes {
        node: HeaderNode
        ref: React.RefObject<HTMLHeadingElement>
        style? : CSSProperties
    }
}

export default Header