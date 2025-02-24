import React, {CSSProperties} from "react"
import {AbstractNode} from "./AbstractNode";
import Paragraph from "./paragraph/Paragraph";
import Header from "./header/Header";
import Image from "./image/Image";
import List from "./list/List";

function NodeFactory(properties: NodeFactory.Attributes) {

    const {node, ref, style} = properties

    switch (node.type) {
        case "paragraph" :
            return <Paragraph node={node} ref={ref} style={style}/>
        case "header" :
            return <Header node={node} ref={ref} style={style}/>
        case "image" :
            return <Image node={node} ref={ref} style={{maxWidth : 400, ...style}}/>
        case "list" :
            return <List node={node} ref={ref} style={style}/>
    }

}

namespace NodeFactory {
    export interface Attributes  {
        node: AbstractNode<any>
        ref : React.RefObject<any>
        style? : CSSProperties
    }
}

export default NodeFactory