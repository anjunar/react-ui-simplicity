import React, {useContext, useEffect, useRef} from "react"
import {ParagraphTreeNode, TextTreeNode} from "../ast/TreeNode";
import EditorContext from "../components/EditorContext";
import DivNode from "./DivNode";

function SpanNode(properties: SpanNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {current, triggerCursor}, event} = useContext(EditorContext)

    const spanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = spanRef.current
    }, [node]);

    useEffect(() => {

        if (event.instance && node === current.container && ! event.handled) {
            let e = event.instance
            let node = current.container as TextTreeNode

            switch (e.type) {
                case "insertCompositionText" :
                case "insertText" : {
                    let start = node.text.substring(0, current.offset)
                    let end = node.text.substring(current.offset)

                    node.text = start + e.data + end
                    current.offset += e.data.length;

                    event.handled = true

                    triggerAST()
                    triggerCursor()

                }
                    break
                case "insertLineBreak" : {
                    let parent = node.parent;
                    let grandParent = parent.parent

                    let index = parent.parentIndex;
                    let newTextNode = new TextTreeNode("");
                    let newDivNode = new ParagraphTreeNode([newTextNode])

                    grandParent.insertChild(index + 1, newDivNode)

                    current.container = newTextNode
                    current.offset = 0

                    event.handled = true

                    triggerAST()
                    triggerCursor()
                } break
                case "keydown" : {

                    switch (e.data) {
                        case "ArrowLeft" : {
                            if (current.offset === 0) {
                                let flattened = root.flatten
                                let indexOf = flattened.indexOf(current.container);
                                if (indexOf > 0) {
                                    current.container = flattened[indexOf - 1]
                                    current.offset = 0
                                }
                            } else {
                                current.offset--
                            }

                            event.handled = true

                            triggerCursor()

                        } break
                        case "ArrowRight" : {
                            if (current.offset === node.text.length) {
                                let flattened = root.flatten
                                let indexOf = flattened.lastIndexOf(current.container);
                                if (indexOf < flattened.length - 1) {
                                    current.container = flattened[indexOf + 1]
                                    current.offset = 1
                                }
                            } else {
                                current.offset++
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
        <span ref={spanRef}>{node.text.length === 0 ? <br/> : node.text}</span>
    )
}

namespace SpanNode {
    export interface Attributes {
        node : TextTreeNode
    }
}

export default SpanNode