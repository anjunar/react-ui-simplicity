import React from "react"
import {AbstractNode} from "./AbstractNode";
import Paragraph from "./paragraph/Paragraph";
import Header from "./header/Header";
import Image from "./image/Image";
import List from "./list/List";

function NodeFactory(properties: NodeFactory.Attributes) {

    const {node, ref} = properties

    switch (node.type) {
        case "paragraph" :
            return <Paragraph node={node} ref={ref}/>
        case "header" :
            return <Header node={node} ref={ref}/>
        case "image" :
            return <Image node={node} ref={ref}/>
        case "list" :
            return <List node={node} ref={ref}/>
    }

}

namespace NodeFactory {
    export interface Attributes  {
        node: AbstractNode<any>
        ref : React.RefObject<any>
    }
}

export default NodeFactory