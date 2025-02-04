import React, {useLayoutEffect, useMemo, useState} from "react"
import {v4} from "uuid";
import NodeFactory from "./nodes/NodeFactory";
import {debounce} from "../../shared/Utils";

export class TreeNode {
    static counter = 0
    version = TreeNode.counter++

    id: string;
    type: string;
    parent: TreeNode | null = null;
    children: TreeNode[] = [];
    previousSibling: TreeNode | null = null;
    nextSibling: TreeNode | null = null;
    attributes: Record<string, any> = {};
    dom : Node

    constructor(type: string, parent: TreeNode | null = null) {
        this.id = v4()
        this.type = type;
        this.parent = parent;
    }

    get isContainer() {
        return this.type === "p" || this.type === "root"
    }

    appendChild(node: TreeNode) {
        node.parent = this;
        if (this.children.length > 0) {
            const lastChild = this.children[this.children.length - 1];
            node.previousSibling = lastChild;
            lastChild.nextSibling = node;
        }
        this.children.push(node);
    }
    appendChildren(nodes: TreeNode[]) {
        for (const node of nodes) {
            this.appendChild(node)
        }
    }

    removeChild(node: TreeNode) {
        this.children = this.children.filter((child) => child.id !== node.id);
        if (node.previousSibling) node.previousSibling.nextSibling = node.nextSibling;
        if (node.nextSibling) node.nextSibling.previousSibling = node.previousSibling;
        node.parent = null;
    }

    removeAllChildren() {
        for (const child of this.children) {
            this.removeChild(child)
        }
    }

    insertAfter(newNode: TreeNode, referenceNode: TreeNode) {
        if (!referenceNode.parent) return;
        let parent = referenceNode.parent;

        let index = parent.children.indexOf(referenceNode);
        newNode.parent = parent;

        newNode.previousSibling = referenceNode;
        newNode.nextSibling = referenceNode.nextSibling;
        if (referenceNode.nextSibling) referenceNode.nextSibling.previousSibling = newNode;
        referenceNode.nextSibling = newNode;

        parent.children.splice(index + 1, 0, newNode);
    }

    findById(id: string): TreeNode | null {
        if (this.id === id) return this;
        for (let child of this.children) {
            let found = child.findById(id);
            if (found) return found;
        }
        return null;
    }

    splitNode(node: TreeNode) {
        if (!node.parent) return null;

        let oldParent = node.parent;
        let newParent = new TreeNode(oldParent.type, oldParent.parent);

        let index = oldParent.children.indexOf(node);
        let movingNodes = oldParent.children.splice(index);

        movingNodes.forEach((n) => newParent.appendChild(n));

        oldParent.parent?.insertAfter(newParent, oldParent);

        return newParent;
    }

    filter(predicate: (node: TreeNode) => boolean): TreeNode[] {
        let result: TreeNode[] = [];
        if (predicate(this)) result.push(this);

        for (let child of this.children) {
            result.push(...child.filter(predicate));
        }
        return result;
    }

    find(predicate: (node: TreeNode) => boolean): TreeNode {
        return this.filter(predicate)[0]
    }

    traverse(callback: (node: TreeNode) => void): void {
        callback(this);

        for (let child of this.children) {
            child.traverse(callback);
        }
    }

    cloneDeep(parent: TreeNode | null = null): TreeNode {
        const newNode = new TreeNode(this.type, parent);
        newNode.id = this.id
        newNode.attributes = { ...this.attributes };

        newNode.children = this.children.map(child => {
            return child.cloneDeep(newNode);
        });

        for (let i = 0; i < newNode.children.length; i++) {
            newNode.children[i].previousSibling = i > 0 ? newNode.children[i - 1] : null;
            newNode.children[i].nextSibling = i < newNode.children.length - 1 ? newNode.children[i + 1] : null;
        }

        return newNode;
    }

    cloneShallow(parent: TreeNode | null = null): TreeNode {
        const newNode = new TreeNode(this.type, parent);
        newNode.id = this.id
        newNode.attributes = this.attributes;

        newNode.children = this.children
        for (const child of newNode.children) {
            child.parent = newNode
        }

        return newNode;
    }

    splice(index: number, deleteCount: number, ...newNodes: TreeNode[]): void {
        const removedNodes = this.children.splice(index, deleteCount, ...newNodes);

        newNodes.forEach((node) => {
            node.parent = this;
        });

        for (let i = 0; i < this.children.length; i++) {
            let prev = this.children[i - 1] || null;
            let next = this.children[i + 1] || null;
            this.children[i].previousSibling = prev;
            this.children[i].nextSibling = next;
        }

        removedNodes.forEach((node) => {
            node.parent = null;
            node.previousSibling = null;
            node.nextSibling = null;
        });
    }

    surroundWith(nodes: TreeNode[], wrapper: TreeNode, index : number = -1): void {

        for (const node of nodes) {
            node.parent.removeChild(node)
        }

        wrapper.appendChildren(nodes)

        if (index === -1) {
            this.appendChild(wrapper)
        } else {
            this.splice(index, 0, wrapper)
        }
    }

    traverseBetween(startNode: TreeNode, endNode: TreeNode, callback: (node: TreeNode) => void): void {
        if (!startNode || !endNode) return;

        let currentNode: TreeNode | null = startNode;
        let reachedEnd = false;

        while (currentNode && !reachedEnd) {
            callback(currentNode);

            if (currentNode === endNode) {
                reachedEnd = true;
                break;
            }

            if (currentNode.children.length > 0) {
                currentNode = currentNode.children[0];
                continue;
            }

            while (currentNode && !currentNode.nextSibling) {
                currentNode = currentNode.parent;
            }

            if (currentNode) {
                currentNode = currentNode.nextSibling;
            }
        }
    }

}


function enterPress(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
    let prev = ast.slice(0, cursorPosition + 1)
    let next = ast.slice(cursorPosition + 1)

    if (node.type === "text" && container.type === "p") {
        let parent = container.parent
        let indexOf = parent.children.indexOf(container)
        parent.removeChild(container)
        parent.surroundWith(prev, new TreeNode("p", parent), indexOf)
        parent.surroundWith(next, new TreeNode("p", parent), indexOf + 1)
    } else {
        if (node.type === "p") {
            let paragraphModel = new TreeNode("p", container)
            container.splice(cursorPosition + 1, 0, paragraphModel)
        } else {
            if (container.type === "root") {
                container.surroundWith(prev, new TreeNode("p", container))
                container.surroundWith(next, new TreeNode("p", container))
            }
        }
    }
}

function backspacePress(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
    if (node.type === "text") {
        ast.splice(cursorPosition, 1)
        let node = ast[cursorPosition - 1];
        if (node) {
            node.attributes.cursor = true
        }
    } else {
        if (node.type === "p") {
            let prevModel = node.previousSibling
            prevModel.appendChildren(node.children)
            container.removeChild(node)
        }
    }
}

function keyPress(event: KeyboardEvent, node: TreeNode, ast: TreeNode[], container: TreeNode, cursorPosition: number) {
    let model = new TreeNode("text")
    model.attributes.text = event.key
    model.attributes.cursor = true

    if (node.type === "p") {
        node.appendChild(model)
        model.parent = node
    } else {
        (container || node).splice(cursorPosition + 1, 0, model);
        model.parent = container || node
    }
}

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [state, setState] = useState<{root : TreeNode}>(() => {
        return {root : new TreeNode("root", null)}
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

            let key = event.key;
            if (node) {
                let container = node.parent;
                let ast = container?.children || node.children

                let cursorPosition = ast.indexOf(node)

                if (key.length === 1) {
                    event.preventDefault()

                    state.root.traverse((node) => node.attributes.cursor = false)

                    keyPress(event, node, ast, container, cursorPosition);

                    setState({...state})
                }

                switch (key) {
                    case "Backspace" : {
                        event.preventDefault()

                        backspacePress(event, node, ast, container, cursorPosition);

                        setState({...state})
                    }
                        break
                    case "Enter" : {
                        event.preventDefault()

                        enterPress(event, node, ast, container, cursorPosition);

                        setState({...state})
                    }
                        break

                }
            }
        }

        return {
            handler : handler
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
            <div contentEditable={true} suppressContentEditableWarning={true} style={{height: 300, padding: "12px", whiteSpace : "pre"}}>
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