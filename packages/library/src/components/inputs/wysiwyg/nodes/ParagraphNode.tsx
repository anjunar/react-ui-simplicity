import React, {useLayoutEffect} from "react";
import {NodeModel, ParagraphModel, TextNodeModel} from "../Wysiwyg";
import {NodeFactory} from "./NodeFactory";

function ParagraphNode(properties : ParagraphNode.Attributes) {

    const {ast, textClickCallback} = properties

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



    const getCursorPosition = (ast : NodeModel[]) => {

        for (const node of ast) {
            if (node instanceof TextNodeModel) {
                if (node.cursor) {
                    return ast.findIndex((elem : any) => node.id === elem.id)
                }
            } else {
                if (node instanceof ParagraphModel) {
                    return getCursorPosition(node.children)
                }
            }
        }

        return -1
    }

    const handler = (event: KeyboardEvent) => {
        event.preventDefault();

        let cursorPosition = getCursorPosition(ast.children);

        if (cursorPosition > -1) {
            if (event.key.length === 1) {
                traverseAST(ast.children, (value) => {
                    if (value instanceof TextNodeModel) {
                        value.cursor = false
                    }
                })

                let model = new TextNodeModel()
                model.text = event.key
                model.cursor = true

                ast.children.splice(cursorPosition + 1, 0, model)
            }

            switch (event.key) {
                case "Backspace" : {
                    ast.children.splice(cursorPosition, 1)
                    let model = ast.children[cursorPosition - 1];
                    if (model instanceof TextNodeModel) {
                        model.cursor = true
                    }
                } break
                case "ArrowLeft" : {
                    let oldModel = ast.children[cursorPosition];
                    if (oldModel instanceof TextNodeModel) {
                        oldModel.cursor = false
                    }
                    let newModel = ast.children[cursorPosition - 1];
                    if (newModel instanceof TextNodeModel) {
                        newModel.cursor = true
                    }
                } break
                case "ArrowRight" : {
                    let oldModel = ast.children[cursorPosition];
                    if (oldModel instanceof TextNodeModel) {
                        oldModel.cursor = false
                    }
                    let newModel = ast.children[cursorPosition + 1];
                    if (newModel instanceof TextNodeModel) {
                        newModel.cursor = true
                    }
                } break
            }
        }

    };

    useLayoutEffect(() => {
        document.addEventListener("keydown", handler)
        return () => {
            document.removeEventListener("keydown", handler)
        }
    }, []);


    return (
        <p>
            {NodeFactory(ast.children, textClickCallback)}
        </p>
    )
}

namespace ParagraphNode {
    export interface Attributes {
        ast: ParagraphModel
        textClickCallback : (node : TextNodeModel) => void
    }
}

export default ParagraphNode