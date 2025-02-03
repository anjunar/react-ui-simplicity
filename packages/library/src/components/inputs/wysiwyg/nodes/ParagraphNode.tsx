import React, {useLayoutEffect} from "react";
import {NodeModel, ParagraphModel, TextNodeModel} from "../Wysiwyg";
import {NodeFactory} from "./NodeFactory";

function ParagraphNode(properties : ParagraphNode.Attributes) {

    const {ast} = properties

    return (
        <p>
            {NodeFactory(ast.children)}
        </p>
    )
}

namespace ParagraphNode {
    export interface Attributes {
        ast: ParagraphModel
    }
}

export default ParagraphNode