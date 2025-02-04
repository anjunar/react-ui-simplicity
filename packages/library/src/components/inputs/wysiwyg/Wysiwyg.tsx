import React, {useLayoutEffect, useMemo, useState} from "react"
import {v4} from "uuid";
import NodeFactory from "./nodes/NodeFactory";
import {debounce} from "../../shared/Utils";
import RootNode from "./nodes/RootNode";

declare global {
    interface Node {
        ast: NodeModel[] | NodeModel;
    }
}

export class NodeModel {
    id: string = v4()
    node: Node
    type: string
    cursor: boolean = false
    selected: boolean = false
    parent : NodeModel
}

export class ContainerModel extends NodeModel {
    children : NodeModel[] = []
}

export class RootModel extends ContainerModel {
    type = "root"
}

export class ParagraphModel extends ContainerModel {
    type = "p"
}

export class TextNodeModel extends NodeModel {
    type = "text"
    text: string
    bold: boolean
    italic: boolean
}

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [state, setState] = useState<NodeModel[]>(() => {
        return [new RootModel()]
    })

    const traverseAST = (ast: NodeModel[], callback: (value: NodeModel, index : number, container : ContainerModel) => any, result? : any) => {
        let outer: any = null;

        const traverse = (ast: NodeModel[], container : ContainerModel) => {

            for (let index = 0; index < ast.length; index++) {
                const node = ast[index];

                let result = callback(node, index, container);
                if (result) {
                    outer = result;
                    return;
                }

                if (node instanceof ContainerModel) {
                    let result = callback(node, index, container);
                    if (result) {
                        outer = result;
                        return;
                    }
                    if (outer) return;
                    traverse(node.children, node);
                }
            }

        };

        traverse(ast, null);

        if (outer) {
            return outer;
        } else {
            return result
        }
    };

    const onBoldClick = (ast: NodeModel[]) => {

        traverseAST(ast, (node) => {
            if (node instanceof TextNodeModel) {
                if (node.selected) {
                    node.bold = true
                }
            }
        })

        setState([...ast])

    }

    const onItalicClick = (ast: NodeModel[]) => {

        traverseAST(ast, (node) => {
            if (node instanceof TextNodeModel) {
                if (node.selected) {
                    node.italic = true
                }
            }
        })

        setState([...ast])
    }

    const key = useMemo(() => {
        let inputQueue = []
        let isProcessing = false

        setInterval(() => {
            if (inputQueue.length === 0) {
                isProcessing = false
            }
        }, 1000)

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
            let {node, index, container} : {node : NodeModel, index : number, container : ContainerModel} = traverseAST(state, (value, index, container) => {
                if (value.cursor) {
                    return {node : value, index : index, container : container}
                }
            }, {node : null, index : 0, container : state})


            let ast
            if (node instanceof RootModel) {
                container = node
                ast = node.children
            } else {
                ast = container.children
            }

            let cursorPosition = index

            if (event.key.length === 1) {
                event.preventDefault()
                traverseAST(state, (value) => {
                    value.cursor = false
                })

                let model = new TextNodeModel()
                model.text = event.key
                model.cursor = true
                model.parent = container

                if (node instanceof ContainerModel) {
                    node.children.push(model)
                } else {
                    ast.splice(cursorPosition + 1, 0, model);
                }

                setState([...state])
            }

            switch (event.key) {
                case "Backspace" : {
                    event.preventDefault()
                    let selection = window.getSelection();
                    if (selection?.rangeCount) {
                        let range = selection.getRangeAt(0);
                        let startOffset = range.startOffset;

                        if (startOffset === 0) {
                            let prevParagraph = ast[index - 1] as ParagraphModel;
                            let paragraphNode = node as ParagraphModel;
                            prevParagraph.children.push(...paragraphNode.children)
                            prevParagraph.children[prevParagraph.children.length - paragraphNode.children.length - 1].cursor = true
                            ast.splice(index, 1)
                        } else {
                            ast.splice(cursorPosition, 1)
                            let node1 = ast[cursorPosition - 1];
                            if (node1) {
                                node1.cursor = true
                            } else {
                                traverseAST(state, (value) => {
                                    if (value instanceof ParagraphModel) {
                                        if (value.children === ast) {
                                            value.cursor = true
                                        }
                                    }
                                })
                            }
                        }
                        setState([...state])
                    }

                }
                    break
                case "Enter" : {
                    event.preventDefault()

                    let prev = ast.slice(0, cursorPosition + 1)
                    let next = ast.slice(cursorPosition + 1)

                    if (node instanceof TextNodeModel && container instanceof ParagraphModel) {
                        let parent : ContainerModel = container.parent as ContainerModel;

                        let prevParagraph = new ParagraphModel()
                        prevParagraph.children = prev
                        prevParagraph.parent = parent

                        let nextParagraph = new ParagraphModel()
                        nextParagraph.children = next
                        nextParagraph.parent = parent

                        let indexOf = parent.children.indexOf(container)
                        parent.children.splice(indexOf, 1)
                        parent.children.splice(indexOf, 0, prevParagraph)
                        parent.children.splice(indexOf + 1, 0, nextParagraph)

                    } else {
                        if (node instanceof ParagraphModel) {
                            let rootModel = node.parent as RootModel;
                            let paragraphModel = new ParagraphModel();
                            paragraphModel.parent = rootModel
                            rootModel.children.splice(cursorPosition + 1, 0, paragraphModel)
                        } else {
                            if (container instanceof RootModel) {
                                let prevParagraph = new ParagraphModel()
                                prevParagraph.children = prev
                                prevParagraph.parent = container

                                let nextParagraph = new ParagraphModel()
                                nextParagraph.children = next
                                nextParagraph.parent = container

                                container.children = []
                                container.children.push(prevParagraph, nextParagraph)
                            }
                        }
                    }

                    setState([...state])
                }
                    break

            }
        }

        return {
            handler : handler
        }
    }, [])

    useLayoutEffect(() => {
        let selectionListener = debounce(() => {
            traverseAST(state, (value) => {
                value.selected = false
                value.cursor = false
            })
            let selection = window.getSelection();
            if (selection?.rangeCount) {
                let rangeAt = selection.getRangeAt(0);

                let startModels = rangeAt.startContainer.ast;
                let endModels = rangeAt.endContainer.ast;

                let startNode, endNode

                if (startModels instanceof ContainerModel && endModels instanceof ContainerModel) {
                    startNode = startModels
                    endNode = endModels
                } else {
                    if (rangeAt.startOffset === 0) {
                        startNode = rangeAt.startContainer.parentNode.parentNode.ast
                    } else {
                        startNode = startModels?.[rangeAt.startOffset - 1]
                    }

                    if (rangeAt.endOffset === 0) {
                        endNode = rangeAt.endContainer.parentNode.parentNode.ast
                    } else {
                        endNode = endModels?.[rangeAt.endOffset - 1]
                    }
                }

                if (startNode && endNode) {

                    if (selection.isCollapsed) {
                        if (startNode.id === startNode.id) {
                            startNode.cursor = true
                        }
                    } else {
                        let selectionEnabler = false
                        traverseAST(state, (value) => {
                            if (selectionEnabler) {
                                value.selected = true
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

        document.addEventListener("keydown", key.handler)
        document.addEventListener("selectionchange", selectionListener)
        return () => {
            document.removeEventListener("keydown", key.handler)
            document.removeEventListener("selectionchange", selectionListener)
        }
    }, []);

    return (
        <div>
            <div contentEditable={true} suppressContentEditableWarning={true} style={{height: 300, padding : "12px"}}>
                <NodeFactory nodes={state}/>
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