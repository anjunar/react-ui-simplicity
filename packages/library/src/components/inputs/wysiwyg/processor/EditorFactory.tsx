import React from "react"
import {AbstractTreeNode, ParagraphTreeNode, RootTreeNode, TextTreeNode} from "../ast/TreeNode";
import SpanNode from "./SpanNode";
import DivNode from "./DivNode";
import RootNode from "./RootNode";

function EditorFactory(properties: TextFactory.Attributes) {

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

export default EditorFactory
