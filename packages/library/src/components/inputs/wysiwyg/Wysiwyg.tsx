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
    cursor: boolean = false
    selected: boolean = false
}

export class ParagraphModel extends NodeModel {
    children: NodeModel[] = []
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
        return []
    })

    const traverseAST = (ast: NodeModel[], callback: (value: NodeModel, index : number, ast: NodeModel[]) => any, result? : any) => {
        let outer: any = null;

        const traverse = (ast: NodeModel[]) => {

            for (let index = 0; index < ast.length; index++) {
                const node = ast[index];

                let result = callback(node, index, ast);
                if (result) {
                    outer = result;
                    return;
                }

                if (node instanceof ParagraphModel) {
                    let result = callback(node, index, ast);
                    if (result) {
                        outer = result;
                        return;
                    }
                    if (outer) return;
                    traverse(node.children);
                }
            }

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
            let {node, index, ast} : {node : NodeModel, index : number, ast : NodeModel[]} = traverseAST(state, (value, index, ast) => {
                if (value.cursor) {
                    return {node : value, index : index, ast : ast}
                }
            }, {node : null, index : 0, ast : state})

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

                    if (node instanceof ParagraphModel) {
                        node.children.push(model)
                    } else {
                        ast.splice(cursorPosition + 1 === ast.length ? cursorPosition + 1 : cursorPosition, 0, model);
                    }

                    setState([...state])
                }

                switch (event.key) {
                    case "Backspace" : {
                        event.preventDefault()
                        ast.splice(cursorPosition, 1)
                        setState([...state])
                        let node = ast[cursorPosition - 1];
                        if (node instanceof TextNodeModel) {
                            node.cursor = true
                        }
                    }
                        break
                    case "Enter" : {
                        event.preventDefault()
                        let {paragraph, paragraphsIndex, paragraphsAST} = traverseAST(state, (node, index, paragraphsAST) => {
                            if (node instanceof ParagraphModel) {
                                if (node.children === ast) {
                                    return {paragraph : node, paragraphsIndex : index, paragraphsAST : paragraphsAST}
                                }
                            }
                        }, {paragraph : null, paragraphsIndex : -1, paragraphsAST : []})

                        let selection = window.getSelection();
                        let rangeAt = selection.getRangeAt(0);

                        cursorPosition = rangeAt.startContainer.textContent.length === rangeAt.endOffset ? cursorPosition + 1 : cursorPosition

                        let prev = ast.slice(0, cursorPosition);
                        let next = ast.slice(cursorPosition);

                        let prevParagraphModel = new ParagraphModel();
                        prevParagraphModel.children = prev
                        let nextParagraphModel = new ParagraphModel();
                        nextParagraphModel.children = next

                        if (paragraph) {
                            paragraphsAST.splice(paragraphsIndex, 1)
                            paragraphsAST.splice(paragraphsIndex , 0, prevParagraphModel)
                            paragraphsAST.splice(paragraphsIndex + 1, 0, nextParagraphModel)
                        } else {
                            ast.length = 0
                            ast.push(prevParagraphModel)
                            ast.push(nextParagraphModel)
                        }

                        setState([...state])
                    }

                }
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

                const startNode = startModels?.[rangeAt.startOffset === startModels.length ? rangeAt.startOffset - 1 : rangeAt.startOffset]
                const endNode = endModels?.[rangeAt.endOffset === endModels.length ? rangeAt.endOffset - 1 : rangeAt.endOffset]

                if (startNode && endNode) {

                    if (selection.isCollapsed) {
                        if (startNode.id === startNode.id) {
                            startNode.cursor = true
                        }
                    } else {
                        let selectionEnabler = false
                        traverseAST(state, (value, ast) => {
                            if (value.id === startNode.id) {
                                selectionEnabler = true
                            }
                            if (selectionEnabler) {
                                value.selected = true
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