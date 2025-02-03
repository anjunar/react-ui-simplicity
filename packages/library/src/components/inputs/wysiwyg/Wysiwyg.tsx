import React, {useLayoutEffect} from "react"
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

    const state = useForm<{ ast: NodeModel[] }>(() => {
        let pm1 = new ParagraphModel();
        let tm1 = new TextNodeModel();
        tm1.text = "t"
        tm1.cursor = true
        pm1.children.push(tm1)

        let pm2 = new ParagraphModel();
        let tm2 = new TextNodeModel();
        tm2.text = "a"
        pm2.children.push(tm2)

        return {
            ast: [pm1, pm2]
        }
    })

    const traverseAST = (ast: NodeModel[], callback: (value: NodeModel, ast: NodeModel[]) => any) => {
        let outer: any = null;

        const traverse = (ast: NodeModel[]) => {
            for (const node of ast) {
                let result = callback(node, ast);
                if (result) {
                    outer = result;
                    return;
                }

                if (node instanceof ParagraphModel) {
                    traverse(node.children);
                    if (outer) return;
                }
            }
        };

        traverse(ast);
        return outer;
    };

    const onBoldClick = (ast: NodeModel[]) => {

        traverseAST(ast, (node) => {
            if (node instanceof TextNodeModel) {
                if (node.selected) {
                    node.bold = true
                }
            }
        })

    }

    const onItalicClick = (ast: NodeModel[]) => {

        traverseAST(ast, (node) => {
            if (node instanceof TextNodeModel) {
                if (node.selected) {
                    node.italic = true
                }
            }
        })

    }

    const handler = debounce((event: KeyboardEvent) => {
        let selection = window.getSelection();

        if (selection?.rangeCount) {

            let rangeAt = selection.getRangeAt(0);
            let selectedAST = rangeAt.startContainer.ast[rangeAt.startOffset - 1];

            if (selectedAST) {
                let {cursorPosition, ast} = traverseAST(state.ast, (value, ast) => {
                    if (value.id === selectedAST.id) {
                        return {cursorPosition : ast.findIndex(node => node.id === value.id), ast : ast}
                    }
                })

                if (event.key.length === 1) {
                    event.preventDefault()
                    traverseAST(ast, (value) => {
                        if (value instanceof TextNodeModel) {
                            value.cursor = false
                        }
                    })

                    let model = new TextNodeModel()
                    model.text = event.key
                    model.cursor = true

                    ast.splice(cursorPosition + 1, 0, model)
                }

                switch (event.key) {
                    case "Backspace" : {
                        event.preventDefault()
                        ast.splice(cursorPosition, 1)
                        ast[cursorPosition - 1].cursor = true
                    } break
                }
            }
        }


    },300);

    useLayoutEffect(() => {
        let selectionListener = debounce(() => {
            traverseAST(state.ast, (value) => {
                if (value instanceof TextNodeModel) {
                    value.selected = false
                    value.cursor = false
                }
            })
            let selection = window.getSelection();
            if (selection?.rangeCount) {
                let rangeAt = selection.getRangeAt(0);

                const startNode = rangeAt.startContainer.ast[rangeAt.startOffset]
                const endNode = rangeAt.endContainer.ast[rangeAt.endOffset]

                if (startNode && endNode) {

                    if (selection.isCollapsed) {
                        if (startNode instanceof TextNodeModel) {
                            if (startNode.id === startNode.id) {
                                startNode.cursor = true
                            }
                        }
                    } else {
                        let selectionEnabler = false
                        traverseAST(state.ast, (value, ast) => {
                            if (value.id === startNode.id) {
                                selectionEnabler = true
                            }
                            if (value.id === endNode?.id) {
                                selectionEnabler = false
                            }
                            if (selectionEnabler) {
                                if (value instanceof TextNodeModel) {
                                    value.selected = true
                                }
                            }
                        })
                    }


                }

            }

        }, 300)

        document.addEventListener("keydown", handler)
        document.addEventListener("selectionchange", selectionListener)
        return () => {
            document.removeEventListener("keydown", handler)
            document.removeEventListener("selectionchange", selectionListener)
        }
    }, []);

    return (
        <div>
            <div contentEditable={true} suppressContentEditableWarning={true} style={{height: 300}}>
                {NodeFactory(state.ast, (node: TextNodeModel) => {
                    traverseAST(state.ast, (value) => {
                        if (value instanceof TextNodeModel) {
                            value.cursor = false
                        }
                    })
                    node.cursor = true
                })}
            </div>
            <button onClick={() => onBoldClick(state.ast)}>Bold</button>
            <button onClick={() => onItalicClick(state.ast)}>Italic</button>
        </div>

    )
}

namespace Wysiwyg {
    export interface Attributes {

    }
}

export default Wysiwyg