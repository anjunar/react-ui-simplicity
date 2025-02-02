import React, {useLayoutEffect} from "react"
import TextNode from "./nodes/TextNode";
import {v4} from "uuid";
import {useForm} from "../../../hooks/UseFormHook";
import {groupByConsecutiveMulti} from "./Util";
import {NodeFactory} from "./nodes/NodeFactory";
import ParagraphNode from "./nodes/ParagraphNode";

export class NodeModel {
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

    const state = useForm<{ast : NodeModel[]}>({
        ast : []
    })

    const traverseAST = (ast : NodeModel[], callback : (value : NodeModel, ast : NodeModel[]) => any) => {
        for (const node of ast) {
            if (node instanceof TextNodeModel) {
                let result = callback(node, ast);
                if (result) {
                    return result
                }
            } else {
                if (node instanceof ParagraphModel) {
                    return traverseAST(node.children, callback)
                }
            }
        }
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

    const getCursorPosition = (ast : NodeModel[]) => {
        return traverseAST(ast, (node, ast) => {
            if (node instanceof TextNodeModel) {
                if (node.cursor) {
                    return ast.findIndex((node : any) => node.cursor)
                }
            }
        })
    }

    const handler = (event: React.KeyboardEvent<HTMLDivElement>) => {
        event.preventDefault();

        let cursorPosition = getCursorPosition(state.ast);

        if (event.key.length === 1) {
            traverseAST(state.ast, (value) => {
                if (value instanceof TextNodeModel) {
                    value.cursor = false
                }
            })

            let model = new TextNodeModel()
            model.text = event.key
            model.cursor = true

            state.ast.splice(cursorPosition + 1, 0, model)
        }
    };

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
                let startIndex = state.ast.findIndex((element:any) => element.node.$resolve === rangeAt.startContainer) + rangeAt.startOffset;
                let endIndex = state.ast.findIndex((element:any) => element.node.$resolve === rangeAt.endContainer) + rangeAt.endOffset;

                for (let i = startIndex; i < endIndex; i++) {
                    // @ts-ignore
                    state.ast[i].selected = true
                }
            }

        }

        let clickListener = () => {
            traverseAST(state.ast, (value) => {
                if (value instanceof TextNodeModel) {
                    value.cursor = false
                }
            })
        };
        document.addEventListener("click", clickListener)
        document.addEventListener("selectionchange", selectionListener)
        return () => {
            document.removeEventListener("click", clickListener)
            document.removeEventListener("selectionchange", selectionListener)
        }
    }, []);


    return (
        <div>
            <div contentEditable={true} suppressContentEditableWarning={true} onKeyDown={handler}>
                { NodeFactory(state.ast) }
            </div>
            <button onClick={() => onBoldClick(state.ast)}>Bold</button>
        </div>
    )
}

namespace Wysiwyg {
    export interface Attributes {

    }
}

export default Wysiwyg