import "./Header.css"
import React, {CSSProperties, useContext, useEffect, useLayoutEffect, useRef, useState} from "react"
import {HeaderBlock, HeaderNode} from "./HeaderNode";
import {Context} from "../../context/Context";

function Header(properties: Header.Attributes) {

    const {node, style} = properties

    const [text, setText] = useState("")

    const {ast, providers, trigger} = useContext(Context)

    const ref = useRef<HTMLHeadingElement>(null);

    function onFocus() {
        node.selected = true

        trigger()
    }

    function onBlur(event: React.FocusEvent) {
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
        node.data = new HeaderBlock(text)
    }, [text]);

    useEffect(() => {
        setText(node.data.text)
    }, [node]);

    useLayoutEffect(() => {
        ref.current.innerHTML = text
    }, []);

    return (
        <h1 ref={ref} className={"header"} contentEditable={true} onBlur={onBlur} style={style} onFocus={onFocus}></h1>
    )
}

namespace Header {
    export interface Attributes {
        node: HeaderNode
        style? : CSSProperties
    }
}

export default Header