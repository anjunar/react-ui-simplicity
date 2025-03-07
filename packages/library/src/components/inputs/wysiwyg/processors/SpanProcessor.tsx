import React, {CSSProperties, useContext, useEffect, useRef} from "react"
import {AbstractNode, RootNode, TextNode} from "../core/TreeNode";
import EditorContext, {GeneralEvent} from "../EditorContext";
import {onArrowDown, onArrowLeft, onArrowRight, onArrowUp} from "../utils/ProcessorUtils";
import {ParagraphNode} from "../blocks/paragraph/ParagraphNode";

const deleteContentBackward = {
    test(value: GeneralEvent): boolean {
        return value.type === "deleteContentBackward"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        if (current.offset > 0) {
            let start = node.text.substring(0, current.offset - 1);
            let end = node.text.substring(current.offset);
            node.text = start + end;

            if (node.text.length === 0) {
                let prevSibling = node.prevSibling as TextNode;
                if (prevSibling) {
                    node.remove()

                    current.container = prevSibling;
                    current.offset = prevSibling.text.length;
                } else {
                    current.offset = 0
                }
            } else {
                current.offset--;
            }
        } else if (node.parent && node.parent.parent) {
            let parent = node.parent;
            let index = parent.parentIndex;

            if (index > 0) {
                let sibling = parent.prevSibling as ParagraphNode;

                let lastNode = sibling.children[sibling.children.length - 1] as TextNode;
                let lastNodeLength = lastNode.text.length;
                lastNode.text += node.text;

                parent.children
                    .slice(node.parentIndex + 1)
                    .forEach(node => sibling.appendChild(node))

                parent.remove()

                current.container = lastNode;
                current.offset = lastNodeLength;
            }
        }
    }
}

const insertText = {
    test(value: GeneralEvent): boolean {
        return value.type === "insertText" || value.type === "insertCompositionText"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        let start = node.text.substring(0, current.offset)
        let end = node.text.substring(current.offset)

        node.text = start + e.data + end
        current.offset += e.data.length;
    }
}

const insertLineBreak = {
    test(value: GeneralEvent): boolean {
        return value.type === "insertLineBreak"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        const parent = node.parent;
        const grandParent = parent.parent;

        const index = parent.parentIndex;

        const textBefore = node.text.substring(0, current.offset);
        const textAfter = node.text.substring(current.offset);


        let treeNodes = parent.children.slice(node.parentIndex + 1);
        node.text = textBefore;

        if (textAfter || treeNodes.length === 0) {
            const newTextNode = new TextNode(textAfter);
            newTextNode.bold = node.bold;
            newTextNode.italic = node.italic;
            newTextNode.deleted = node.deleted;
            newTextNode.sub = node.sub;
            newTextNode.sup = node.sup;
            const newDivNode = new ParagraphNode([newTextNode, ...treeNodes]);

            grandParent.insertChild(index + 1, newDivNode);

            current.container = newTextNode;
            current.offset = 0;

        } else {
            const newDivNode = new ParagraphNode(treeNodes);

            grandParent.insertChild(index + 1, newDivNode);

            current.container = treeNodes[0];
            current.offset = 0;
        }


    }
}

const arrowLeft = {
    test(value: GeneralEvent) {
        return value.data === "ArrowLeft" && value.type === "keydown"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        if (current.offset === 0) {
            onArrowLeft(root, current);
        } else {
            current.offset--
        }
    }
}

const arrowRight = {
    test(value: GeneralEvent) {
        return value.data === "ArrowRight" && value.type === "keydown"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        if (current.offset === node.text.length) {
            onArrowRight(root, current);
        } else {
            current.offset++
        }
    }
}

const arrowUp = {
    test(value: GeneralEvent) {
        return value.data === "ArrowUp" && value.type === "keydown"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        onArrowUp(node, current, root)
    }
}

const arrowDown = {
    test(value: GeneralEvent) {
        return value.data === "ArrowDown" && value.type === "keydown"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        onArrowDown(node, current, root)
    }
}

const deleteKey = {
    test(value: GeneralEvent) {
        return value.data === "Delete" && value.type === "keydown"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        if (current.offset < node.text.length) {
            let start = node.text.substring(0, current.offset);
            let end = node.text.substring(current.offset + 1);
            node.text = start + end;

        } else if (node.parent && node.parent.parent) {
            let parent = node.parent;
            let grandParent = parent.parent;
            let index = parent.parentIndex;

            if (index < grandParent.children.length - 1) {
                let sibling = parent.nextSibling as ParagraphNode;
                let firstTextNode = sibling.children[0] as TextNode;

                let nodeLength = node.text.length;
                node.text += firstTextNode.text;

                sibling.removeChild(firstTextNode);

                for (const child of Array.from(sibling.children)) {
                    parent.appendChild(child);
                }

                if (sibling.children.length === 0) {
                    sibling.remove();
                }

                current.container = node;
                current.offset = nodeLength;
            }
        }
    }
}

const endKey = {
    test(value: GeneralEvent) {
        return value.data === "End" && value.type === "keydown"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        current.offset = node.text.length
    }
}

const homeKey = {
    test(value: GeneralEvent) {
        return value.data === "Home" && value.type === "keydown"
    },
    process(current: { container: AbstractNode; offset: number }, node: TextNode, e: GeneralEvent, root: RootNode) {
        current.offset = 0
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
    deleteKey,
    homeKey,
    endKey
]

function generateStyleObject(node : TextNode) {
    let style: CSSProperties = {};
    if (node.fontFamily) {
        style.fontFamily = node.fontFamily;
    }

    if (node.fontSize) {
        style.fontSize = node.fontSize;
    }

    if (node.color) {
        style.color = node.color;
    }

    if (node.backgroundColor) {
        style.backgroundColor = node.backgroundColor;
    }
    return style;
}

function generateStyleClassNames(node : TextNode) {
    let classNames: string[] = []

    if (node.bold) {
        classNames.push("bold")
    }

    if (node.italic) {
        classNames.push("italic")
    }

    if (node.deleted) {
        classNames.push("deleted")
    }

    if (node.sub) {
        classNames.push("subscript")
    }

    if (node.sup) {
        classNames.push("superscript")
    }

    if (node.block) {
        classNames.push(node.block)
    }

    return classNames;
}

function SpanProcessor(properties: SpanNode.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}, event} = useContext(EditorContext)

    const spanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = spanRef.current.firstChild
    }, [node.text]);

    useEffect(() => {

        if (event.instance && node === currentCursor?.container && !event.handled) {

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

    let classNames = generateStyleClassNames(node);
    let style = generateStyleObject(node);

    return (
        <span ref={spanRef}
              style={Object.keys(style).length === 0 ? null : style}
              className={classNames.length === 0 ? null : classNames.join(" ")}>
            {node.text.length === 0 ? <br/> : node.text}
        </span>
    )
}

namespace SpanNode {
    export interface Attributes {
        node: TextNode
    }
}

export default SpanProcessor