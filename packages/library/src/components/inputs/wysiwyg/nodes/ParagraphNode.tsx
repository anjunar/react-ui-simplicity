import React, {useLayoutEffect} from "react";
import {NodeModel, ParagraphModel, TextNodeModel} from "../Wysiwyg";
import {NodeFactory} from "./NodeFactory";

function ParagraphNode(properties : ParagraphNode.Attributes) {

    const {ast, textClickCallback} = properties

    return (
        <p>
            {NodeFactory(ast.children, textClickCallback)}
        </p>
    )
}

namespace ParagraphNode {
    export interface Attributes {
        ast: ParagraphModel
        textClickCallback : (node : TextNodeModel) => void
    }
}

export default ParagraphNode