import {AbstractContainerNode} from "../../core/TreeNode";
import {TokenLineNode} from "./TokenLineNode";

export class CodeNode extends AbstractContainerNode<TokenLineNode> {
    type: string = "code"

    text: string = "import \"./Editor.css\"\nimport React, {useContext,useState} from \"react\""

    constructor(children: TokenLineNode[]) {
        super(children);
    }
}