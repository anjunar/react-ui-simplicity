import React, {useEffect, useRef} from "react";
import {ParagraphModel} from "../Wysiwyg";
import {NodeFactory} from "./NodeFactory";

function ParagraphNode(properties: ParagraphNode.Attributes) {

    const {ast} = properties

    const p = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        p.current.ast = [ast]
    }, [ast]);

    return (
        <div ref={p}>
            {
                ast.children.length === 0 ? <br/> : ""
            }
            {NodeFactory(ast.children)}
        </div>
    )
}

namespace ParagraphNode {
    export interface Attributes {
        ast: ParagraphModel
    }
}

export default ParagraphNode