import React from "react"
import {AbstractTreeNode, HeadingTreeNode, ParagraphTreeNode, RootTreeNode, TextTreeNode} from "../core/TreeNode";
import SpanProcessor from "./SpanProcessor";
import DivProcessor from "./DivProcessor";
import RootProcessor from "./RootProcessor";
import HeadingProcessor from "./HeadingProcessor";

function ProcessorFactory(properties: TextFactory.Attributes) {

    const {node} = properties

    switch (node.type) {
        case "text" : return <SpanProcessor node={node as TextTreeNode}/>
        case "p" : return <DivProcessor node={node as ParagraphTreeNode}/>
        case "root" : return <RootProcessor node={node as RootTreeNode}/>
        case "heading" : return <HeadingProcessor node={node as HeadingTreeNode}/>
    }

}

namespace TextFactory {
    export interface Attributes {
        node : AbstractTreeNode
    }
}

export default ProcessorFactory
