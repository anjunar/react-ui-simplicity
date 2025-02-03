import React, {useLayoutEffect, useMemo, useState} from "react"
import {v4} from "uuid";
import {useForm} from "../../../hooks/UseFormHook";
import {NodeFactory} from "./nodes/NodeFactory";
import ActiveObject from "../../../domain/container/ActiveObject";
import {debounce} from "../../shared/Utils";

declare global {
    interface Node {
        ast: NodeModel[];
    }
}

export class NodeModel extends ActiveObject {
    id: string = v4()
    node: Node
    type: string
}

export class ParagraphModel extends NodeModel {
    children: NodeModel[] = []
    type = "p"
}

export class TextNodeModel extends NodeModel {
    type = "text"
    text: string
    cursor: boolean = false
    selected: boolean = false
    bold: boolean
    italic: boolean
}

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [state, setState] = useState<NodeModel[]>(() => {
        return []
    })

    const traverseAST = (ast: NodeModel[], callback: (value: NodeModel, index : number, ast: NodeModel[]) => any, result? : any) => {
        let outer: any = null;

        const traverse = (ast: NodeModel[]) => {
            ast.forEach((node, index) => {
                let result = callback(node, index, ast);
                if (result) {
                    outer = result;
                    return;
                }

                if (node instanceof ParagraphModel) {
                    traverse(node.children);
                    if (outer) return;
                }
            })
        };

        traverse(ast);

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
            let {index, ast} = traverseAST(state, (value, index, ast) => {
                if (value instanceof TextNodeModel) {
                    if (value.cursor) {
                        return {index : index, ast : ast}
                    }
                }
            }, {index : 0, ast : state})

            if (ast) {
                let cursorPosition = index

                if (event.key.length === 1) {
                    event.preventDefault()
                    traverseAST(state, (value) => {
                        if (value instanceof TextNodeModel) {
                            value.cursor = false
                        }
                    })

                    let model = new TextNodeModel()
                    model.text = event.key
                    model.cursor = true

                    ast.splice(cursorPosition + 1, 0, model);
                    setState([...ast])
                }

                switch (event.key) {
                    case "Backspace" : {
                        event.preventDefault()
                        ast.splice(cursorPosition, 1)
                        let node = ast[cursorPosition - 1];
                        if (node) {
                            node.cursor = true
                        }
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
        let selectionListener = () => {
            traverseAST(state, (value) => {
                if (value instanceof TextNodeModel) {
                    value.selected = false
                    value.cursor = false
                }
            })
            let selection = window.getSelection();
            if (selection?.rangeCount) {
                let rangeAt = selection.getRangeAt(0);

                let models = rangeAt.startContainer.ast;

                const startNode = models?.[rangeAt.startOffset === models.length ? rangeAt.startOffset - 1 : rangeAt.startOffset]
                const endNode = models?.[rangeAt.endOffset === models.length ? rangeAt.endOffset - 1 : rangeAt.endOffset]

                if (startNode && endNode) {

                    if (selection.isCollapsed) {
                        if (startNode instanceof TextNodeModel) {
                            if (startNode.id === startNode.id) {
                                startNode.cursor = true
                            }
                        }
                    } else {
                        let selectionEnabler = false
                        traverseAST(state, (value, ast) => {
                            if (value.id === startNode.id) {
                                selectionEnabler = true
                            }
                            if (selectionEnabler || (value.id === startNode.id && value.id === endNode.id)) {
                                if (value instanceof TextNodeModel) {
                                    value.selected = true
                                }
                            }
                            if (value.id === endNode.id) {
                                selectionEnabler = false
                            }
                        })
                    }


                }

            }

        }

        document.addEventListener("keydown", key.handler)
        document.addEventListener("selectionchange", selectionListener)
        return () => {
            document.removeEventListener("keydown", key.handler)
            document.removeEventListener("selectionchange", selectionListener)
        }
    }, []);

    return (
        <div>
            <div contentEditable={true} suppressContentEditableWarning={true} style={{height: 300}}>
                {NodeFactory(state)}
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