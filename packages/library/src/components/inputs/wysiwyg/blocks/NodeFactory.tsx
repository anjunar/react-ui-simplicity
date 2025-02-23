import React from "react"
import {AbstractNode} from "./AbstractNode";
import Paragraph from "./paragraph/Paragraph";
import Header from "./header/Header";
import Image from "./image/Image";

function NodeFactory(properties: NodeFactory.Attributes) {

    const {node, ref, ...rest} = properties

    switch (node.type) {
        case "paragraph" :
            return <Paragraph node={node} ref={ref} {...rest}/>
        case "header" :
            return <Header node={node} ref={ref} {...rest}/>
        case "image" :
            return <Image node={node} ref={ref} {...rest}/>
    }

}

namespace NodeFactory {
    export interface Attributes extends React.HTMLAttributes<HTMLDivElement> {
        node: AbstractNode<any>
        ref : React.RefObject<any>
    }
}

export default NodeFactory