import React, {useContext, useEffect, useRef} from "react"
import {ParagraphTreeNode, TextTreeNode} from "../ast/TreeNode";
import TextFactory from "../TextFactory";
import EditorContext from "../components/EditorContext";
import cursor from "../components/Cursor";

function DivNode(properties: DivNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {current, triggerCursor}, event} = useContext(EditorContext)

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    useEffect(() => {

        if (event.instance && node === current.container && ! event.handled) {
            let e = event.instance
            let node = current.container as ParagraphTreeNode

            switch (e.type) {
                case "insertCompositionText" :
                case "insertText" : {

                    if (node.children.length === 0) {
                        let textNode = new TextTreeNode(e.data)
                        node.appendChild(textNode)

                        current.container = textNode
                        current.offset = e.data.length

                        event.handled = true

                        triggerAST()
                        triggerCursor()

                    }

                }
                    break
                case "keydown" : {

                    switch (e.data) {
                        case "ArrowLeft" : {
                            let flattened = root.flatten
                            let indexOf = flattened.indexOf(current.container);
                            if (indexOf > 0) {
                                current.container = flattened[indexOf - 1]
                                if (current.container instanceof TextTreeNode) {
                                    current.offset = current.container.text.length
                                } else {
                                    current.offset = 0
                                }
                            }

                            event.handled = true

                            triggerCursor()

                        } break
                        case "ArrowRight" : {
                            let flattened = root.flatten
                            let indexOf = flattened.lastIndexOf(current.container);
                            if (indexOf < flattened.length) {
                                current.container = flattened[indexOf + 1]
                                current.offset = 0
                            }

                            event.handled = true

                            triggerCursor()
                        }
                    }

                } break
            }

        }

    }, [event.instance]);



    return (
        <div ref={divRef}>
            {
                node.children.map(node => <TextFactory key={node.id} node={node}/>)
            }
        </div>
    )
}

namespace DivNode {
    export interface Attributes {
        node : ParagraphTreeNode
    }
}

export default DivNode