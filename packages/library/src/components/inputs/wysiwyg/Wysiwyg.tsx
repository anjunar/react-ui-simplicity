import React, {useLayoutEffect, useMemo, useState} from "react"
import NodeFactory from "./nodes/NodeFactory";
import {debounce} from "../../shared/Utils";
import {TreeNode} from "./TreeNode";


const insertUl = {
    key(value : string) {
        return value === "Enter" || value === "Backspace"
    },
    handler(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
        let indexOf = ast.indexOf(node);

        let ulNode = new TreeNode("ul");
        let liNode = new TreeNode("li");
        let pNode = new TreeNode("p");
        liNode.appendChild(pNode)
        ulNode.appendChild(liNode)

        container.splice(indexOf + 1, 0, ulNode)
    }

}

const enterPress = {
    key(value: string) {
        return value === "Enter"
    },
    handler(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
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
    handler(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
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

const handlerRegistry = [enterPress, backspacePress]

function executeKeyPress(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {

    return handlerRegistry
        .find(handler => handler.key(event.key))
        ?.handler(event, node, ast, container, cursorPosition)

}


function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [ast, setAst] = useState<{ root: TreeNode }>(() => {
        let treeNode = new TreeNode("root", null);
        let treeNode1 = new TreeNode("p");
        treeNode.appendChild(treeNode1)
        return {root: treeNode}
    })

    const onBoldClick = () => {

        ast.root.traverse((node) => {
            if (node.type === "text") {
                if (node.attributes.selected) {
                    node.attributes.bold = true
                }
            }
        })

        setAst({...ast})

    }

    const onItalicClick = () => {

        ast.root.traverse((node) => {
            if (node.type === "text") {
                if (node.attributes.selected) {
                    node.attributes.italic = true
                }
            }
        })

        setAst({...ast})

    }

    const onListClick = () => {
        let node = ast.root.find((node) => node.attributes.cursor)

        if (node) {
            let container = node.parent;
            let nodes = container?.children || node.children
            let cursorPosition = nodes.indexOf(node)

            insertUl.handler(null, node,  nodes, container, cursorPosition)

            setAst({...ast})

        }
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
            if (handlerRegistry.some(handler => handler.key(event.key))) {
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
            let node = ast.root.find((node) => node.attributes.cursor)

            if (node) {
                let container = node.parent;
                let nodes = container?.children || node.children

                let cursorPosition = nodes.indexOf(node)

                // nodes.root.traverse((node) => node.attributes.cursor = false)

                let executed = executeKeyPress(event, node, nodes, container, cursorPosition);

                if (executed) {
                    setAst({...ast})
                }
            }
        }

        return {
            handler: handler
        }
    }, [])


    useLayoutEffect(() => {
        let selectionListener = debounce(() => {

            ast.root.traverse((node) => {
                node.attributes.selected = false
                node.attributes.cursor = false
            })

            let selection = window.getSelection();
            if (selection?.rangeCount) {
                let rangeAt = selection.getRangeAt(0);

                let startNode, endNode

                let startModels = ast.root.filter((node) => node.dom === rangeAt.startContainer)
                if (startModels.length === 1 && startModels[0].isContainer) {
                    startNode = startModels[0]
                } else {
                    if (rangeAt.startOffset === 0) {
                        startNode = ast.root.find((node) => node.dom === rangeAt.startContainer).parent
                    } else {
                        startNode = startModels?.[rangeAt.startOffset - 1]
                    }
                }

                let endModels = ast.root.filter((node) => node.dom === rangeAt.endContainer)
                if (endModels.length === 1 && endModels[0].isContainer) {
                    endNode = endModels[0]
                } else {
                    if (rangeAt.endOffset === 0) {
                        endNode = ast.root.find((node) => node.dom === rangeAt.endContainer).parent
                    } else {
                        endNode = endModels?.[rangeAt.endOffset - 1]
                    }
                }

                if (startNode && endNode) {
                    if (selection.isCollapsed) {
                        startNode.attributes.cursor = true
                    } else {
                        ast.root.traverseBetween(startNode, endNode, (node) => {
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
        <div style={{height : "100%"}}>
            <div contentEditable={true} suppressContentEditableWarning={true} style={{height: "80%", padding: "12px", whiteSpace: "pre"}}>
                <NodeFactory nodes={[ast.root]} astChange={() => setAst({...ast})}/>
            </div>
            <button onClick={() => onBoldClick()}>Bold</button>
            <button onClick={() => onItalicClick()}>Italic</button>
            <button onClick={() => onListClick()}>New List</button>
        </div>

    )
}

namespace Wysiwyg {
    export interface Attributes {

    }
}

export default Wysiwyg