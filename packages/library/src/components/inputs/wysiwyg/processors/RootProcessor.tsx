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

        if (currentEvent.instance && node === currentCursor?.container) {
            let e = currentEvent.instance
            let node = currentCursor.container as ParagraphNode

            switch (e.type) {
                case "insertCompositionText" :
                case "insertText" : {

                    if (node.children.length === 0) {

                        currentEvent.queue.push({
                            source : node,
                            handle(): void {
                                let textNode = new TextNode(e.data)
                                node.appendChild(textNode)

                                currentCursor.container = textNode
                                currentCursor.offset = e.data.length
                            }
                        })


                    }

                }
                    break
                case "keydown" : {

                    switch (e.data) {
                        case "ArrowLeft" : {


                            currentEvent.queue.push({
                                source : node,
                                handle(): void {
                                    onArrowLeft(root, currentCursor);
                                }
                            })

                        } break
                        case "ArrowRight" : {


                            currentEvent.queue.push({
                                source : node,
                                handle(): void {
                                    onArrowRight(root, currentCursor);
                                }

                            })

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