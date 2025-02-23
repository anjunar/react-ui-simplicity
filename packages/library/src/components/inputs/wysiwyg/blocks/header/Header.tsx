import "./Header.css"
import React, {Attributes, forwardRef, useEffect, useState} from "react"
import {HeaderBlock, HeaderNode} from "./HeaderNode";

function Header(properties: Header.Attributes) {

    const {node, ref, ...rest} = properties

    const [text, setText] = useState("")

    function onChange(event: React.FocusEvent) {
        let target = event.target as HTMLDivElement;
        setText(target.innerHTML)
    }

    useEffect(() => {
        node.data = new HeaderBlock(text)
    }, [text]);

    useEffect(() => {
        setText(node.data.text)
    }, [node]);

    return (
        <h1 ref={ref} contentEditable={true} dangerouslySetInnerHTML={{__html: text}} onBlur={onChange} {...rest}></h1>
    )
}

namespace Header {
    export interface Attributes extends React.HTMLAttributes<HTMLDivElement> {
        node: HeaderNode
        ref : React.RefObject<HTMLHeadingElement>
    }
}

export default Header