import {AbstractNode, TextNode} from "../../core/TreeNode";
import {CSSProperties} from "react";
import {CommandRule} from "../../commands/KeyCommand";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import {findNearestTextRight} from "../../core/TreeNodes";
import {onArrowDown, onArrowLeft, onArrowRight, onArrowUp} from "../../utils/ProcessorUtils";
import EditorState from "../../contexts/EditorState";

export function generateStyleObject(node: TextNode) {
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

export function generateStyleClassNames(node: TextNode) {
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

export const deleteContentBackward: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "Backspace" || value.type === "deleteContentBackward") && node === container
    },
    process(current, node, currentEvent, root) {
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

                let lastNode = sibling.children[sibling.children.length - 1]
                if (lastNode instanceof TextNode) {
                    let lastNodeLength = lastNode.text.length;
                    lastNode.text += node.text;

                    parent.children
                        .slice(node.parentIndex + 1)
                        .forEach(node => sibling.appendChild(node))

                    current.container = lastNode;
                    current.offset = lastNodeLength;

                    parent.remove()
                } else {
                    if (node.text === "") {
                        let textRight = findNearestTextRight(root, node.parent) as TextNode;
                        current.container = textRight
                        current.offset = textRight.text.length

                        parent.remove()
                    }
                }

            }
        }
    }
}
export const compositionUpdate: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "compositionUpdate" && node === container
    },
    process(current, node: TextNode, currentEvent,) {

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
export const insertText: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return (value.type === "insertText" || value.type === "insertCompositionText") && node === container
    },
    process(current, node, currentEvent, root) {
        let start = node.text.substring(0, current.offset)
        let end = node.text.substring(current.offset)

        node.text = start + currentEvent.data + end
        node.text = node.text.replaceAll(" ", "\u00A0")
        current.offset += currentEvent.data.length;

    }
}
export const insertLineBreak: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "insertLineBreak" && node === container
    },
    process(current, node: TextNode, currentEvent, root) {
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
export const arrowLeft: CommandRule<TextNode> = {
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
export const arrowRight: CommandRule<TextNode> = {
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
export const arrowUp: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowUp" && node === container
    },
    process(current, node, currentEvent, root) {
        onArrowUp(node, current, root)
    }
}
export const arrowDown: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowDown" && node === container
    },
    process(current, node, currentEvent, root) {
        onArrowDown(node, current, root)
    }
}
export const deleteKey: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "Delete" && node === container
    },
    process(current, node, currentEvent, root) {
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

                firstTextNode.remove()

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
export const endKey: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "End" && node === container
    },
    process(current, node, currentEvent, root) {
        current.offset = node.text.length
    }
}
export const homeKey: CommandRule<TextNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "Home" && node === container
    },
    process(current, node, currentEvent, root) {
        current.offset = 0
    }
}