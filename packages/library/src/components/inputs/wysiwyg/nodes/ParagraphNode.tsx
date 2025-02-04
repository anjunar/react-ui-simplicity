import React, {useEffect, useRef} from "react";
import {ParagraphModel} from "../Wysiwyg";
import {NodeFactory} from "./NodeFactory";

function ParagraphNode(properties: ParagraphNode.Attributes) {

    const {ast} = properties

    const paragraph = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const range = document.createRange();
        range.selectNodeContents(paragraph.current);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);


        paragraph.current.ast = [ast]
    }, [ast]);

    return (
        <div ref={paragraph}>
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