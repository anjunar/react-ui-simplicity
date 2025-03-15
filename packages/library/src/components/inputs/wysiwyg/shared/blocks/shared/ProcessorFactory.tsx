import React, {useContext} from "react"
import {AbstractNode, RootNode, TextNode} from "../../core/TreeNode";
import SpanProcessor from "./SpanProcessor";
import RootProcessor from "./RootProcessor";

import {WysiwygContext} from "../../contexts/WysiwygState";
import {EditorContext} from "../../contexts/EditorState";

function ProcessorFactory(properties: TextFactory.Attributes) {

    const {node} = properties

    const {providers} = useContext(EditorContext)

    switch (node.type) {
        case "text" :
            return <SpanProcessor node={node as TextNode}/>
        case "root" :
            return <RootProcessor node={node as RootNode}/>
        default : {
            let provider = providers.find(provider => provider.type === node.type);
            return React.createElement(provider.processor, {node})
        }
    }

}

namespace TextFactory {
    export interface Attributes {
        node: AbstractNode
    }
}

export default ProcessorFactory
