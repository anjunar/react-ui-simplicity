import React, {useLayoutEffect} from "react"
import TextNode from "./nodes/TextNode";
import {v4} from "uuid";
import {useForm} from "../../../hooks/UseFormHook";
import {groupByConsecutiveMulti} from "./Util";
import {NodeFactory} from "./nodes/NodeFactory";
import ParagraphNode from "./nodes/ParagraphNode";
import ActiveObject from "../../../domain/container/ActiveObject";
import {arrayMembrane} from "../../../membrane/Membrane";

export class NodeModel extends ActiveObject {
    id : string = v4()
    node : Node
    type : string
}

export class ParagraphModel extends NodeModel {
    children : NodeModel[] = []
    type = "p"
}

export class TextNodeModel extends NodeModel {
    type = "text"
    text : string
    cursor : boolean = false
    selected : boolean = false
    bold : boolean
    italic : boolean
}

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const state = useForm<{ast : NodeModel[]}>(() => {
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
            ast : [pm1, pm2]
        }
    })

    const traverseAST = (ast : NodeModel[], callback : (value : NodeModel, ast : NodeModel[]) => any) => {
        let result = null
        for (const node of ast) {
            if (node instanceof TextNodeModel) {
                let result = callback(node, ast);
                if (result) {
                    return result
                }
            } else {
                if (node instanceof ParagraphModel) {
                    result = traverseAST(node.children, callback)
                }
            }
        }
        return result
    }

    const onBoldClick = (ast : NodeModel[]) => {

        traverseAST(ast, (node) => {
            if (node instanceof TextNodeModel) {
                if (node.selected) {
                    node.bold = true
                }
            }
        })

    }

    const onItalicClick = (ast : NodeModel[]) => {

        traverseAST(ast, (node) => {
            if (node instanceof TextNodeModel) {
                if (node.selected) {
                    node.italic = true
                }
            }
        })

    }

    useLayoutEffect(() => {
        let selectionListener = () => {
            traverseAST(state.ast, (value) => {
                if (value instanceof TextNodeModel) {
                    value.selected = false
                }
            })
            let selection = window.getSelection();
            if (selection?.rangeCount && ! selection.isCollapsed) {
                let rangeAt = selection.getRangeAt(0);

                const startNode= traverseAST(state.ast, (node, ast) => {
                    if (node.$resolve.node === rangeAt.startContainer) {
                        let index = ast.findIndex(elem => node.id === elem.id) + rangeAt.startOffset;
                        return ast[index]
                    }
                })

                const endNode = traverseAST(state.ast, (node, ast) => {
                    if (node.$resolve.node === rangeAt.endContainer) {
                        let index = ast.findIndex(elem => node.id === elem.id) + rangeAt.endOffset;
                        return ast[index]
                    }
                })

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

        document.addEventListener("selectionchange", selectionListener)
        return () => {
            document.removeEventListener("selectionchange", selectionListener)
        }
    }, []);


    return (
        <div>
            <div contentEditable={true} suppressContentEditableWarning={true} style={{height : 300}}>
                { NodeFactory(state.ast, (node : TextNodeModel) => {
                    traverseAST(state.ast, (value) => {
                        if (value instanceof TextNodeModel) {
                            value.$resolve.cursor = false
                        }
                    })
                    node.cursor = true
                }) }
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