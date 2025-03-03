import React from "react"
import {AbstractNode, HeadingNode, ParagraphNode, RootNode, TextNode} from "../core/TreeNode";
import SpanProcessor from "./SpanProcessor";
import DivProcessor from "./DivProcessor";
import RootProcessor from "./RootProcessor";
import HeadingProcessor from "./HeadingProcessor";

function ProcessorFactory(properties: TextFactory.Attributes) {

    const {node} = properties

    switch (node.type) {
        case "text" : return <SpanProcessor node={node as TextNode}/>
        case "p" : return <DivProcessor node={node as ParagraphNode}/>
        case "root" : return <RootProcessor node={node as RootNode}/>
        case "heading" : return <HeadingProcessor node={node as HeadingNode}/>
    }

}

namespace TextFactory {
    export interface Attributes {
        node : AbstractNode
    }
}

export default ProcessorFactory
