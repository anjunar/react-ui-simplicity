import React, {CSSProperties, useContext} from "react"
import {AbstractNode} from "./AbstractNode";
import {WysiwygContext} from "../../context/WysiwygContext";

function NodeFactory(properties: NodeFactory.Attributes) {

    const {node, style} = properties

    const {providers} = useContext(WysiwygContext)

    let provider = providers.find(provider => node instanceof provider.factory);

    return React.createElement(provider.component, {node: node, style: style})
}

namespace NodeFactory {
    export interface Attributes {
        node: AbstractNode<any>
        style?: CSSProperties
    }
}

export default NodeFactory