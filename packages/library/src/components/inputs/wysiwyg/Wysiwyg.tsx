import React, {useLayoutEffect, useMemo, useState} from "react"
import {v4} from "uuid";
import NodeFactory from "./nodes/NodeFactory";
import {debounce} from "../../shared/Utils";

declare global {
    interface Node {
        ast: TreeNode[] | TreeNode;
    }
}

export class TreeNode {
    id: string;
    type: string;
    parent: TreeNode | null = null;
    children: TreeNode[] = [];
    previousSibling: TreeNode | null = null;
    nextSibling: TreeNode | null = null;
    attributes: Record<string, any> = {};

    constructor(type: string, parent: TreeNode | null = null) {
        this.id = v4()
        this.type = type;
        this.parent = parent;
    }

    appendChild(node: TreeNode) {
        node.parent = this;
        if (this.children.length > 0) {
            node.previousSibling = this.children[this.children.length - 1];
            this.children[this.children.length - 1].nextSibling = node;
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

    clone(parent: TreeNode | null = null): TreeNode {
        const newNode = new TreeNode(this.type, parent)
        newNode.id = this.id
        newNode.parent = parent
        newNode.children = this.children
        for (const child of newNode.children) {
            child.parent = this
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
}


function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [state, setState] = useState<TreeNode>(() => {
        return new TreeNode("root", null)
    })

    const onBoldClick = (ast: TreeNode) => {

        ast.traverse((node) => {
            if (node.type === "text") {
                if (node.attributes.selected) {
                    node.attributes.bold = true
                }
            }
        })

        setState(ast.clone())

    }

    const onItalicClick = (ast: TreeNode) => {

        ast.traverse((node) => {
            if (node.type === "text") {
                if (node.attributes.selected) {
                    node.attributes.italic = true
                }
            }
        })

        setState(ast.clone())

    }

    const handleKeyPress = (event: KeyboardEvent) => {
        let node = state.find((node) => node.attributes.cursor)

        if (node) {
            let container = node.parent;
            let ast = container?.children || node.children

            let cursorPosition = ast.indexOf(node)

            if (event.key.length === 1) {
                event.preventDefault()
                state.traverse((node) => node.attributes.cursor = false)

                let model = new TreeNode("text")
                model.attributes.text = event.key
                model.attributes.cursor = true

                if (node.type === "p") {
                    node.appendChild(model)
                    model.parent = node
                } else {
                    ast.splice(cursorPosition + 1, 0, model);
                    model.parent = container
                }

                setState(state.clone())
            }

            switch (event.key) {
                case "Backspace" : {
                    event.preventDefault()

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

                    setState(state.clone())
                }
                    break
                case "Enter" : {
                    event.preventDefault()

                    let prev = ast.slice(0, cursorPosition + 1)
                    let next = ast.slice(cursorPosition + 1)

                    if (node.type === "text" && container.type === "p") {
                        let parent = container.parent

                        let prevParagraph = new TreeNode("p", parent)
                        prevParagraph.appendChildren(prev)

                        let nextParagraph = new TreeNode("p", parent)
                        nextParagraph.appendChildren(next)

                        let indexOf = parent.children.indexOf(container)
                        parent.splice(indexOf, 1)
                        parent.splice(indexOf, 0, prevParagraph)
                        parent.splice(indexOf + 1, 0, nextParagraph)

                    } else {
                        if (node.type === "p") {
                            let rootModel = container
                            let paragraphModel = new TreeNode("p", rootModel)
                            rootModel.splice(cursorPosition + 1, 0, paragraphModel)
                        } else {
                            if (container.type === "root") {
                                container.removeAllChildren()

                                let prevParagraph = new TreeNode("p", container)
                                prevParagraph.appendChildren(prev)

                                let nextParagraph = new TreeNode("p", container)
                                nextParagraph.appendChildren(next)

                                container.appendChildren([prevParagraph, nextParagraph])
                            }
                        }
                    }

                    setState(state.clone())
                }
                    break

            }
        } else {
            if (event.key.length === 1) {
                event.preventDefault()
            }

        }
    }

    useLayoutEffect(() => {
        let selectionListener = debounce(() => {

            state.traverse((node) => {
                node.attributes.selected = false
                node.attributes.cursor = false
            })

            let selection = window.getSelection();
            if (selection?.rangeCount) {
                let rangeAt = selection.getRangeAt(0);

                let startModels = rangeAt.startContainer.ast;
                let endModels = rangeAt.endContainer.ast;

                let startNode, endNode

                if (startModels instanceof TreeNode && endModels instanceof TreeNode) {
                    startNode = startModels
                    endNode = endModels
                } else {
                    if (rangeAt.startOffset === 0) {
                        startNode = rangeAt.startContainer.ast[0].parent
                    } else {
                        startNode = startModels?.[rangeAt.startOffset - 1]
                    }

                    if (rangeAt.endOffset === 0) {
                        endNode = rangeAt.endContainer.ast[0].parent
                    } else {
                        endNode = endModels?.[rangeAt.endOffset - 1]
                    }
                }

                if (startNode && endNode) {

                    if (selection.isCollapsed) {
                        startNode.attributes.cursor = true
                    } else {
                        let selectionEnabler = false
                        state.traverse((value) => {
                            if (selectionEnabler) {
                                value.attributes.selected = true
                            }
                            if (value.id === startNode.id) {
                                selectionEnabler = true
                            }
                            if (value.id === endNode.id) {
                                selectionEnabler = false
                            }
                        })
                    }


                }

            }

        }, 100)

        document.addEventListener("keydown", handleKeyPress)
        document.addEventListener("selectionchange", selectionListener)
        return () => {
            document.removeEventListener("keydown", handleKeyPress)
            document.removeEventListener("selectionchange", selectionListener)
        }
    }, []);

    return (
        <div>
            <div contentEditable={true} suppressContentEditableWarning={true} style={{height: 300, padding: "12px"}}>
                <NodeFactory nodes={[state]}/>
            </div>
            <button onClick={() => onBoldClick(state)}>Bold</button>
            <button onClick={() => onItalicClick(state)}>Italic</button>
        </div>

    )
}

namespace Wysiwyg {
    export interface Attributes {

    }
}

export default Wysiwyg