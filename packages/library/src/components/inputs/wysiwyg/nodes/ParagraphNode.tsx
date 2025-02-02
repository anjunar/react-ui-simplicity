import React from "react";
import {NodeModel} from "../Wysiwyg";
import {NodeFactory} from "./NodeFactory";

export default function ParagraphNode({ast}: { ast: NodeModel[] }) {
    return (
        <p>
            {NodeFactory(ast)}
        </p>
    )
}