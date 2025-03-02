import React, {useContext, useEffect, useRef} from "react"
import {AbstractTreeNode, ParagraphTreeNode, RootTreeNode, TextTreeNode} from "../ast/TreeNode";
import EditorContext, {GeneralEvent} from "../components/EditorContext";
import {onArrowDown, onArrowLeft, onArrowRight, onArrowUp} from "./Nodes";

const deleteContentBackward =  {
    test(value : GeneralEvent) : boolean {
        return value.type === "deleteContentBackward"
    },
    process(current: { container: AbstractTreeNode; offset: number }, node: TextTreeNode, e: GeneralEvent, root: RootTreeNode) {
        if (current.offset > 0) {
            let start = node.text.substring(0, current.offset - 1);
            let end = node.text.substring(current.offset);
            node.text = start + end;

            current.offset--;

        } else if (node.parent && node.parent.parent) {
            let parent = node.parent;
            let grandParent = parent.parent;
            let index = parent.parentIndex;

            if (index > 0) {
                let sibling = grandParent.children[index - 1] as ParagraphTreeNode;
                let lastTextNode = sibling.children[sibling.children.length - 1] as TextTreeNode;

                lastTextNode.text += node.text;

                parent.remove()

                current.container = lastTextNode;
                current.offset = lastTextNode.text.length;

            }
        }
    }
}

const insertText =  {
    test(value : GeneralEvent) : boolean {
        return value.type === "insertText" || value.type === "insertCompositionText"
    },
    process(current: { container: AbstractTreeNode; offset: number }, node: TextTreeNode, e: GeneralEvent, root: RootTreeNode) {
        let start = node.text.substring(0, current.offset)
        let end = node.text.substring(current.offset)

        node.text = start + e.data + end
        current.offset += e.data.length;
    }
}

const insertLineBreak =  {
    test(value : GeneralEvent) : boolean {
        return value.type === "insertLineBreak"
    },
    process(current: { container: AbstractTreeNode; offset: number }, node: TextTreeNode, e: GeneralEvent, root: RootTreeNode) {
        const parent = node.parent;
        const grandParent = parent.parent;

        const index = parent.parentIndex;

        const textBefore = node.text.substring(0, current.offset);
        const textAfter = node.text.substring(current.offset);

        const newTextNode = new TextTreeNode(textAfter);

        node.text = textBefore;

        const newDivNode = new ParagraphTreeNode([newTextNode]);

        grandParent.insertChild(index + 1, newDivNode);

        current.container = newTextNode;
        current.offset = 0;
    }
}

const arrowLeft = {
    test(value : GeneralEvent) {
        return value.data === "ArrowLeft" && value.type === "keydown"
    },
    process(current: { container: AbstractTreeNode; offset: number }, node: TextTreeNode, e: GeneralEvent, root: RootTreeNode) {
        if (current.offset === 0) {
            onArrowLeft(root, current);
        } else {
            current.offset--
        }
    }
}

const arrowRight = {
    test(value : GeneralEvent) {
        return value.data === "ArrowRight" && value.type === "keydown"
    },
    process(current: { container: AbstractTreeNode; offset: number }, node: TextTreeNode, e: GeneralEvent, root: RootTreeNode) {
        if (current.offset === node.text.length) {
            onArrowRight(root, current);
        } else {
            current.offset++
        }
    }
}

const arrowUp = {
    test(value : GeneralEvent) {
        return value.data === "ArrowUp" && value.type === "keydown"
    },
    process(current: { container: AbstractTreeNode; offset: number }, node: TextTreeNode, e: GeneralEvent, root: RootTreeNode) {
        onArrowUp(node, current)
    }
}

const arrowDown = {
    test(value : GeneralEvent) {
        return value.data === "ArrowDown" && value.type === "keydown"
    },
    process(current: { container: AbstractTreeNode; offset: number }, node: TextTreeNode, e: GeneralEvent, root: RootTreeNode) {
        onArrowDown(node, current)
    }
}

const deleteKey = {
    test(value : GeneralEvent) {
        return value.data === "Delete" && value.type === "keydown"
    },
    process(current: { container: AbstractTreeNode; offset: number }, node: TextTreeNode, e: GeneralEvent, root: RootTreeNode) {
        if (current.offset < node.text.length) {
            let start = node.text.substring(0, current.offset);
            let end = node.text.substring(current.offset + 1);
            node.text = start + end;

        } else if (node.parent && node.parent.parent) {
            let parent = node.parent;
            let grandParent = parent.parent;
            let index = parent.parentIndex;

            if (index < grandParent.children.length - 1) {
                let sibling = grandParent.children[index + 1] as ParagraphTreeNode;
                let firstTextNode = sibling.children[0] as TextTreeNode;

                node.text += firstTextNode.text;

                sibling.removeChild(firstTextNode);

                if (sibling.children.length === 0) {
                    sibling.remove();
                }

                current.container = node;
                current.offset = node.text.length;
            }
        }
    }
}

const registry = [
    deleteContentBackward,
    insertText,
    insertLineBreak,
    arrowLeft,
    arrowRight,
    arrowUp,
    arrowDown,
    deleteKey
]

function SpanNode(properties: SpanNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {currentCursor, triggerCursor}, event} = useContext(EditorContext)

    const spanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = spanRef.current
    }, [node]);

    useEffect(() => {

        if (event.instance && node === currentCursor?.container && ! event.handled) {
            
            for (const handler of registry) {
                if (handler.test(event.instance)) {
                    handler.process(currentCursor, node, event.instance, root)
                    event.handled = true
                    triggerAST()
                    triggerCursor()
                    break
                }
            }

        }

    }, [event.instance]);

    return (
        <span ref={spanRef} style={{fontWeight : node.bold ? "700" : ""}}>{node.text.length === 0 ? <br/> : node.text}</span>
    )
}

namespace SpanNode {
    export interface Attributes {
        node : TextTreeNode
    }
}

export default SpanNode