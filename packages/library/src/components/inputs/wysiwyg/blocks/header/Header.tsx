import "./Header.css"
import React, {useEffect, useState} from "react"
import {HeaderBlock, HeaderNode} from "./HeaderNode";

function Header(properties: Header.Attributes) {

    const {node, ref, ...rest} = properties

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

    return (
        <h1 className={"header"} ref={ref} contentEditable={true} dangerouslySetInnerHTML={{__html: text}} onBlur={onChange} {...rest}></h1>
    )
}

namespace Header {
    export interface Attributes {
        node: HeaderNode
        ref: React.RefObject<HTMLHeadingElement>
    }
}

export default Header