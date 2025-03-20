import React, {useContext, useEffect, useRef} from "react"
import {CodeLineNode} from "./CodeLineNode";
import EditorState, {EditorContext} from "../../contexts/EditorState";
import {CommandRule} from "../../commands/KeyCommand";
import {onArrowDown, onArrowLeft, onArrowRight, onArrowUp} from "../../utils/ProcessorUtils";
import {AbstractNode} from "../../core/TreeNode";

const deleteContentBackward: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "Backspace" || value.type === "deleteContentBackward") && node === container
    },
    process(current, node, currentEvent, root) {
        if (current.offset > 0) {
            let start = node.text.substring(0, current.offset - 1);
            let end = node.text.substring(current.offset);
            node.text = start + end;

            current.offset--
        } else {
            let parentIndex = node.parentIndex;

            if (parentIndex > 0) {
                let prevSibling = node.prevSibling as CodeLineNode
                node.remove()

                current.container = prevSibling
                current.offset = prevSibling.text.length
            }

        }
    }
}

const compositionUpdate: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "compositionUpdate" && node === container
    },
    process(current, node: CodeLineNode, currentEvent,) {

        let subString = node.text.substring(current.offset - currentEvent.data.length, current.offset)

        if (subString === currentEvent.data) {
            let start = node.text.substring(0, current.offset - currentEvent.data.length)
            let end = node.text.substring(current.offset)

            node.text = start + end
            // node.source = node.source.replaceAll(" ", "\u00A0")
            current.offset -= currentEvent.data.length;
        } else {
            let start = node.text.substring(0, current.offset)
            let end = node.text.substring(current.offset)

            node.text = start + currentEvent.data + end
            // node.source = node.source.replaceAll(" ", "\u00A0")
            current.offset += currentEvent.data.length;

        }


    }
}

const insertText: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "insertText" || value.type === "insertCompositionText") && node === container
    },
    process(current, node, currentEvent, root) {
        let start = node.text.substring(0, current.offset)
        let end = node.text.substring(current.offset)

        node.text = start + currentEvent.data + end
        // node.source = node.source.replaceAll(" ", "\u00A0")
        current.offset += currentEvent.data.length;

    }
}

const insertLineBreak: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "insertLineBreak" && node === container
    },
    process(current, node: CodeLineNode, currentEvent, root) {
        let start = node.text.substring(0, current.offset)
        let end = node.text.substring(current.offset)

        let parent = node.parent;
        let parentIndex = node.parentIndex;

        let lineNode = new CodeLineNode(end);
        parent.insertChild(parentIndex + 1, lineNode)

        node.text = start

        current.container = lineNode
        current.offset = 0
    }
}

const arrowLeft: CommandRule<CodeLineNode> = {
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

const arrowRight: CommandRule<CodeLineNode> = {
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

const arrowUp: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowUp" && node === container
    },
    process(current, node, currentEvent, root) {
        let prevSibling = node.prevSibling

        if (prevSibling instanceof CodeLineNode) {
            current.container = prevSibling
            if (current.offset > prevSibling.text.length) {
                current.offset = prevSibling.text.length
            }
        } else {
            onArrowUp(node, current, root)
        }
    }
}

const arrowDown: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowDown" && node === container
    },
    process(current, node, currentEvent, root) {
        let nextSibling = node.nextSibling

        if (nextSibling instanceof CodeLineNode) {
            current.container = nextSibling
            if (current.offset > nextSibling.text.length) {
                current.offset = nextSibling.text.length
            }
        } else {
            onArrowDown(node, current, root)
        }
    }
}

const deleteKey: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "Delete" && node === container
    },
    process(current, node, currentEvent, root) {
        if (current.offset < node.text.length) {
            let start = node.text.substring(0, current.offset);
            let end = node.text.substring(current.offset + 1);
            node.text = start + end;
        }
    }
}

const endKey: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "End" && node === container
    },
    process(current, node, currentEvent, root) {
        current.offset = node.text.length
    }
}

const homeKey: CommandRule<CodeLineNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "Home" && node === container
    },
    process(current, node, currentEvent, root) {
        current.offset = 0
    }
}

const registry: CommandRule<CodeLineNode>[] = [
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

function CodeLineProcessor(properties: CodeBlockProcessor.Attributes) {

    const {node} = properties

    const {ast: {root}, cursor: {currentCursor}, event: {currentEvent}} = useContext(EditorContext)

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = divRef.current.firstChild
    }, [node.text, divRef.current?.firstChild]);

    useEffect(() => {

        if (currentEvent.instance && currentCursor) {

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

    return (
        <div ref={divRef} style={{width : "max-content"}}>
            {
                node.text ? node.text : "\u200B"
            }
            {
                node.text.length === 0 ? <br/> : ""
            }
        </div>
    )
}

namespace CodeBlockProcessor {
    export interface Attributes {
        node: CodeLineNode
    }
}

export default CodeLineProcessor
