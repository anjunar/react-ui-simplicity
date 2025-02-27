import React, {CSSProperties, useContext} from "react"
import {AbstractNode} from "./AbstractNode";
import {Context} from "../../context/Context";

function NodeFactory(properties: NodeFactory.Attributes) {

    const {node, style} = properties

    const {providers} = useContext(Context)

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