import React, {useLayoutEffect, useMemo, useState} from "react"
import NodeFactory from "./nodes/NodeFactory";
import {debounce} from "../../shared/Utils";
import {TreeNode} from "./TreeNode";

const enterPress = {
    key(value: string) {
        return value === "Enter"
    },
    handler: function enterPress(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
        event.preventDefault()
        let prev = ast.slice(0, cursorPosition + 1)
        let next = ast.slice(cursorPosition + 1)

        if (node.type === "text" && container.type === "p") {
            let parent = container.parent
            let indexOf = parent.children.indexOf(container)
            parent.removeChild(container)
            parent.surroundWith(prev, new TreeNode("p", parent), indexOf)
            parent.surroundWith(next, new TreeNode("p", parent), indexOf + 1)
            return true
        } else {
            if (node.type === "p") {
                let paragraphModel = new TreeNode("p", container)
                container.splice(cursorPosition + 1, 0, paragraphModel)
                return true
            } else {
                if (container.type === "root") {
                    container.surroundWith(prev, new TreeNode("p", container))
                    container.surroundWith(next, new TreeNode("p", container))
                    return true
                }
            }
        }
        return false
    }
}

const backspacePress = {
    key(value : string) {
        return value === "Backspace"
    },
    handler : function backspacePress(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
        event.preventDefault()
        if (node.type === "text") {
            ast.splice(cursorPosition, 1)
            let node = ast[cursorPosition - 1];
            if (node) {
                node.attributes.cursor = true
            }
            return true
        } else {
            if (node.type === "p") {
                let prevModel = node.previousSibling
                prevModel.appendChildren(node.children)
                container.removeChild(node)
            }
            return true
        }
    }
}

const keyPress = {
    key(value : string) {
        return value.length === 1
    },
    handler : function keyPress(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
        event.preventDefault()
        let model = new TreeNode("text")
        model.attributes.text = event.key
        model.attributes.cursor = true

        if (node.type === "p") {
            node.appendChild(model)
            model.parent = node
            return true
        } else {
            (container || node).splice(cursorPosition + 1, 0, model);
            model.parent = container || node
            return true
        }
    }
}

const handlerRegistry = [keyPress, enterPress, backspacePress]

function executeKeyPress(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {

    return handlerRegistry
        .find(handler => handler.key(event.key))
        ?.handler(event, node, ast, container, cursorPosition)

}


function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [state, setState] = useState<{ root: TreeNode }>(() => {
        return {root: new TreeNode("root", null)}
    })

    const onBoldClick = (ast: TreeNode) => {

        ast.traverse((node) => {
            if (node.type === "text") {
                if (node.attributes.selected) {
                    node.attributes.bold = true
                }
            }
        })

        setState({...state})

    }

    const onItalicClick = (ast: TreeNode) => {

        ast.traverse((node) => {
            if (node.type === "text") {
                if (node.attributes.selected) {
                    node.attributes.italic = true
                }
            }
        })

        setState({...state})

    }

    const key = useMemo(() => {
        let inputQueue = []
        let isProcessing = false

        const processQueue = () => {
            if (inputQueue.length === 0) {
                isProcessing = false;
                return;
            }

            const batch = [...inputQueue];
            inputQueue = [];

            batch.forEach(event => {
                handleKeyPress(event);
            });

            requestAnimationFrame(processQueue)
        };

        const handler = (event: KeyboardEvent) => {
            if (event.key.length === 1 || event.key === "Backspace") {
                event.preventDefault()

                inputQueue.push(event);

                if (!isProcessing) {
                    isProcessing = true;
                    requestAnimationFrame(processQueue)
                }
            } else {
                handleKeyPress(event)
            }
        };

        const handleKeyPress = (event: KeyboardEvent) => {
            let node = state.root.find((node) => node.attributes.cursor)

            if (node) {
                let container = node.parent;
                let ast = container?.children || node.children

                let cursorPosition = ast.indexOf(node)

                state.root.traverse((node) => node.attributes.cursor = false)

                let executed = executeKeyPress(event, node, ast, container, cursorPosition);

                if (executed) {
                    setState({...state})
                }
            }
        }

        return {
            handler: handler
        }
    }, [])


    useLayoutEffect(() => {
        let selectionListener = debounce(() => {

            state.root.traverse((node) => {
                node.attributes.selected = false
                node.attributes.cursor = false
            })

            let selection = window.getSelection();
            if (selection?.rangeCount) {
                let rangeAt = selection.getRangeAt(0);

                let startModels = state.root.filter((node) => node.dom === rangeAt.startContainer)
                let endModels = state.root.filter((node) => node.dom === rangeAt.endContainer)

                let startNode, endNode

                if (startModels.length === 1 && startModels[0].isContainer) {
                    startNode = startModels[0]
                    endNode = endModels[0]
                } else {
                    if (rangeAt.startOffset === 0) {
                        startNode = state.root.find((node) => node.dom === rangeAt.startContainer).parent
                    } else {
                        startNode = startModels?.[rangeAt.startOffset - 1]
                    }

                    if (rangeAt.endOffset === 0) {
                        endNode = state.root.find((node) => node.dom === rangeAt.endContainer).parent
                    } else {
                        endNode = endModels?.[rangeAt.endOffset - 1]
                    }
                }

                if (startNode && endNode) {
                    if (selection.isCollapsed) {
                        startNode.attributes.cursor = true
                    } else {
                        state.root.traverseBetween(startNode, endNode, (node) => {
                            node.attributes.selected = true
                        })
                    }


                }

            }
        }, 100)

        document.addEventListener("keydown", key.handler)
        document.addEventListener("selectionchange", selectionListener)
        return () => {
            document.removeEventListener("keydown", key.handler)
            document.removeEventListener("selectionchange", selectionListener)
        }
    }, []);

    return (
        <div>
            <div contentEditable={true} suppressContentEditableWarning={true} style={{height: 300, padding: "12px", whiteSpace: "pre"}}>
                <NodeFactory nodes={[state.root]}/>
            </div>
            <button onClick={() => onBoldClick(state.root)}>Bold</button>
            <button onClick={() => onItalicClick(state.root)}>Italic</button>
        </div>

    )
}

namespace Wysiwyg {
    export interface Attributes {

    }
}

export default Wysiwyg