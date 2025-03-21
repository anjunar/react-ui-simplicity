import React, {useContext, useEffect, useRef} from "react"
import {TokenNode} from "./TokenNode";
import {CommandRule} from "../../commands/KeyCommand";
import EditorState, {EditorContext} from "../../contexts/EditorState";
import {onArrowLeft, onArrowRight} from "../../utils/ProcessorUtils";
import {AbstractNode} from "../../core/TreeNode";
import {findParent} from "../../core/TreeNodes";
import {CodeNode} from "./CodeNode";

const deleteContentBackward: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "Backspace" || value.type === "deleteContentBackward") && node === container
    },
    process(current, node, currentEvent, root) {
    }
}

const compositionUpdate: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "compositionUpdate" && node === container
    },
    process(current, node: TokenNode, currentEvent,) {

        if (typeof node.text === "string") {
            let subString = node.text.substring(current.offset - currentEvent.data.length, current.offset)

            if (subString === currentEvent.data) {
                let start = node.text.substring(0, current.offset - currentEvent.data.length)
                let end = node.text.substring(current.offset)

                node.text = start + end
                node.text = node.text.replaceAll(" ", "\u00A0")
                current.offset -= currentEvent.data.length;
            } else {
                let start = node.text.substring(0, current.offset)
                let end = node.text.substring(current.offset)

                node.text = start + currentEvent.data + end
                node.text = node.text.replaceAll(" ", "\u00A0")
                current.offset += currentEvent.data.length;

            }
        }
    }
}

const insertText: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "insertText" || value.type === "insertCompositionText") && node === container
    },
    process(current, node, currentEvent, root) {
        if (typeof node.text === "string") {
            let code = findParent(node, elem => elem.type === "code") as CodeNode
            let index = node.index + current.offset

            let start = code.text.substring(0, index)
            let end = code.text.substring(index)

            code.text = start + currentEvent.data + end
            current.offset += currentEvent.data.length
        }
    }
}

const insertLineBreak: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "insertLineBreak" && node === container
    },
    process(current, node: TokenNode, currentEvent, root) {


    }
}

const arrowLeft: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowLeft" && node === container
    },
    process(current, node, currentEvent, root) {
        if (current.offset === 0) {
            onArrowLeft(root, current);
        } else {
            current.offset--
        }
    }
}

const arrowRight: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowRight" && node === container
    },
    process(current, node, currentEvent, root) {
        if (current.offset === node.text.length) {
            onArrowRight(root, current);
        } else {
            current.offset++
        }
    }
}

const arrowUp: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowUp" && node === container
    },
    process(current, node, currentEvent, root) {
        // onArrowUp(node, current, root)
    }
}

const arrowDown: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowDown" && node === container
    },
    process(current, node, currentEvent, root) {
        // onArrowDown(node, current, root)
    }
}

const deleteKey: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "Delete" && node === container
    },
    process(current, node, currentEvent, root) {
    }
}

const endKey: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "End" && node === container
    },
    process(current, node, currentEvent, root) {
        current.offset = node.text.length
    }
}

const homeKey: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "Home" && node === container
    },
    process(current, node, currentEvent, root) {
        current.offset = 0
    }
}

const registry: CommandRule<TokenNode>[] = [
    deleteContentBackward,
    insertText,
    compositionUpdate,
    insertLineBreak,
    arrowLeft,
    arrowRight,
    arrowUp,
    arrowDown,
    deleteKey,
    homeKey,
    endKey
]

function TokenProcessor(properties: TokenProcessor.Attributes) {

    const {node} = properties

    const {ast: {root}, cursor: {currentCursor}, event: {currentEvent}} = useContext(EditorContext)

    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {

        if (currentEvent.instance) {

            for (const handler of registry) {
                if (handler.test(currentEvent.instance, node, currentCursor.container)) {

                    currentEvent.queue.push({
                        source: node,
                        type: currentEvent.instance.type,
                        handle() {
                            handler.process(currentCursor, node, currentEvent.instance, root)
                        }
                    })

                    break
                }
            }

        }

    }, [currentEvent.instance]);

    useEffect(() => {
        if (spanRef.current) {
            node.dom = spanRef.current.firstChild
        }
    }, [node.text]);

    if (typeof node.text === "string") {
        return <span ref={spanRef} className={`token ${node.type}`}>
            {node.text}
            {
                node.text.length === 0 ? "\u200B"  : ""
            }
        </span>
    }

    return (
        <>
            {
                node.text.map(node => <TokenProcessor key={node.id} node={node}/>)
            }
        </>
    )
}

namespace TokenProcessor {
    export interface Attributes {
        node: TokenNode
    }
}

export default TokenProcessor