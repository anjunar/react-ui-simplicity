import React, {useContext, useEffect, useRef} from "react"
import {RootNode, TextNode} from "../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import ParagraphProcessor from "../blocks/paragraph/ParagraphProcessor";
import {onArrowLeft, onArrowRight} from "../utils/ProcessorUtils";
import {ParagraphNode} from "../blocks/paragraph/ParagraphNode";
import {EditorContext} from "../EditorState";

function RootProcessor(properties: RootNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {currentCursor, triggerCursor}, event : {currentEvent}} = useContext(EditorContext)

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (currentEvent.instance && node === currentCursor?.container && ! currentEvent.handled) {
            let e = currentEvent.instance
            let node = currentCursor.container as ParagraphNode

            switch (e.type) {
                case "insertCompositionText" :
                case "insertText" : {

                    if (node.children.length === 0) {
                        let textNode = new TextNode(e.data)
                        let paragraphNode = new ParagraphNode([textNode])
                        node.appendChild(paragraphNode)

                        currentCursor.container = textNode
                        currentCursor.offset = e.data.length

                        currentEvent.handled = true

                        triggerAST()
                        triggerCursor()

                    }

                }
                    break
                case "keydown" : {

                    switch (e.data) {
                        case "ArrowLeft" : {
                            onArrowLeft(root, currentCursor);

                            currentEvent.handled = true

                            triggerCursor()

                        } break
                        case "ArrowRight" : {
                            onArrowRight(root, currentCursor);

                            currentEvent.handled = true

                            triggerCursor()
                        }
                    }

                } break
            }

        }

    }, [currentEvent.instance]);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <div ref={divRef} className={"root"}>
            {
                node.children.map(node => (<ProcessorFactory key={node.id} node={node}/>))
            }
        </div>
    )
}

namespace RootNode {
    export interface Attributes {
        node: RootNode
    }
}

export default RootProcessor