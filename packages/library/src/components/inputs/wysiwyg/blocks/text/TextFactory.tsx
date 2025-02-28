import React from "react"
import {AbstractTreeNode, ParagraphTreeNode, RootTreeNode, TextTreeNode} from "./AST";
import SpanNode from "./components/SpanNode";
import DivNode from "./components/DivNode";
import RootNode from "./components/RootNode";

function TextFactory(properties: TextFactory.Attributes) {

    const {node} = properties

    switch (node.type) {
        case "text" : return <SpanNode node={node as TextTreeNode}/>
        case "p" : return <DivNode node={node as ParagraphTreeNode}/>
        case "root" : return <RootNode node={node as RootTreeNode}/>
    }

}

namespace TextFactory {
    export interface Attributes {
        node : AbstractTreeNode
    }
}

export default TextFactory
