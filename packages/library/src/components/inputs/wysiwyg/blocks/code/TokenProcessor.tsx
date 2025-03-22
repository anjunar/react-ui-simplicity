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
        if (typeof node.text === "string") {
            let code = findParent(node, elem => elem.type === "code") as CodeNode
            let index = node.index + current.offset

            let start = code.text.substring(0, index - 1)
            let end = code.text.substring(index)

            let newText = start + end;

            let [container, newIndex] = code.updateText(newText, index - 2);
            current.container = container
            current.offset = newIndex + 1

            if (current.offset < 1) {
                let prevSibling = current.container.prevSibling as TokenNode
                current.container = prevSibling
                current.offset = prevSibling.text.length
            }
        }
    }
}

const compositionUpdate: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "compositionUpdate" && node === container
    },
    process(current, node: TokenNode, currentEvent,) {

        if (typeof node.text === "string") {
            let offset = node.index + current.offset;

            let subString = node.text.substring(offset - currentEvent.data.length, offset)

            if (subString === currentEvent.data) {
                let start = node.text.substring(0, offset - currentEvent.data.length)
                let end = node.text.substring(offset)

                node.text = start + end
                node.text = node.text.replaceAll(" ", "\u00A0")
                current.offset -= currentEvent.data.length;
            } else {
                let start = node.text.substring(0, offset)
                let end = node.text.substring(offset)

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

            let newText = start + currentEvent.data + end;

            let [container, newIndex] = code.updateText(newText, index);

            current.container = container
            current.offset = newIndex + 1
        }
    }
}

const insertLineBreak: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode): boolean {
        return value.type === "insertLineBreak" && node === container
    },
    process(current, node: TokenNode, currentEvent, root) {

        if (typeof node.text === "string") {
            let code = findParent(node, elem => elem.type === "code") as CodeNode
            let index = node.index + current.offset

            let start = code.text.substring(0, index)
            let end = code.text.substring(index)

            let newText = start + "\n" + end

            let result = code.updateText(newText, index + 1);
            if (! result) {
                result = code.updateText(newText, index + 2);
            }

            let [container, newIndex] = result

            current.container = container
            current.offset = newIndex

        }


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
    process(currentCursor, node, currentEvent, root) {
        const currentNode = currentCursor.container as TokenNode;
        if (!currentNode || typeof currentNode.text !== "string") return;

        const codeNode = findParent(currentNode, node => node.type === "code") as CodeNode;
        if (!codeNode) return;

        const lines = codeNode.text.split("\n");

        let charCount = 0;
        let currentLine = 0;
        let column = currentCursor.offset;

        for (let i = 0; i < lines.length; i++) {
            if (charCount + lines[i].length >= currentNode.index) {
                currentLine = i;
                column = currentNode.index - charCount + currentCursor.offset;
                break;
            }
            charCount += lines[i].length + 1;
        }

        if (currentLine === 0) return;

        let prevLineStart = charCount - (lines[currentLine - 1].length + 1);
        let prevLineEnd = charCount - 1;

        // Anpassung für leere Zeilen
        let prevLine = lines[currentLine - 1];
        while (prevLine.length === 0 && currentLine > 1) {
            currentLine--;
            prevLineStart -= (lines[currentLine - 1].length + 1);
            prevLineEnd = prevLineStart + lines[currentLine - 1].length;
            prevLine = lines[currentLine - 1];
        }

        let newIndex = Math.min(prevLineStart + column, prevLineEnd);

        function findNodeByIndex(node: AbstractNode): TokenNode | null {
            if (node instanceof CodeNode) {
                for (const child of node.children) {
                    let result = findNodeByIndex(child);
                    if (result) return result
                }
            }
            if (!(node instanceof TokenNode) || typeof node.text !== "string") return null;
            if (node.index <= newIndex && node.index + node.text.length >= newIndex) return node;
            if (Array.isArray(node.text)) {
                for (let child of node.text) {
                    let found = findNodeByIndex(child);
                    if (found) return found;
                }
            }
            return null;
        }

        let newNode = findNodeByIndex(codeNode);
        if (newNode) {
            currentCursor.container = newNode;
            currentCursor.offset = newIndex - newNode.index;
        }
    }
}

const arrowDown: CommandRule<TokenNode> = {
    test(value: EditorState.GeneralEvent, node: AbstractNode, container: AbstractNode) {
        return value.type === "ArrowDown" && node === container
    },
    process(currentCursor, node, currentEvent, root) {

        const currentNode = currentCursor.container as TokenNode;
        if (!currentNode || typeof currentNode.text !== "string") return;

        const codeNode = findParent(currentNode, node => node.type === "code") as CodeNode;
        if (!codeNode) return;

        const lines = codeNode.text.split("\n");

        let charCount = 0;
        let currentLine = 0;
        let column = currentCursor.offset;

        for (let i = 0; i < lines.length; i++) {
            if (charCount + lines[i].length >= currentNode.index) {
                currentLine = i;
                column = currentNode.index - charCount + currentCursor.offset;
                break;
            }
            charCount += lines[i].length + 1;
        }

        if (currentLine === lines.length - 1) return;

        let nextLineStart = charCount + lines[currentLine].length + 1;
        let nextLineEnd = nextLineStart + lines[currentLine + 1].length;

        // Anpassung für leere Zeilen
        let nextLine = lines[currentLine + 1];
        while (nextLine.length === 0 && currentLine < lines.length - 2) {
            currentLine++;
            nextLineStart += (lines[currentLine].length + 1);
            nextLineEnd = nextLineStart + lines[currentLine + 1].length;
            nextLine = lines[currentLine + 1];
        }

        let newIndex = Math.min(nextLineStart + column, nextLineEnd);

        function findNodeByIndex(node: AbstractNode): TokenNode | null {
            if (node instanceof CodeNode) {
                for (const child of node.children) {
                    let result = findNodeByIndex(child);
                    if (result) return result
                }
            }
            if (!(node instanceof TokenNode) || typeof node.text !== "string") return null;
            if (node.index <= newIndex && node.index + node.text.length >= newIndex) return node;
            if (Array.isArray(node.text)) {
                for (let child of node.text) {
                    let found = findNodeByIndex(child);
                    if (found) return found;
                }
            }
            return null;
        }

        let newNode = findNodeByIndex(codeNode);
        if (newNode) {
            currentCursor.container = newNode;
            currentCursor.offset = newIndex - newNode.index;
        }
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