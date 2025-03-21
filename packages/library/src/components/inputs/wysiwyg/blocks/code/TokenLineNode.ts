import {AbstractContainerNode} from "../../core/TreeNode";
import {TokenNode} from "./TokenNode";

export class TokenLineNode extends AbstractContainerNode<TokenNode> {
    type: string = "token-line"

    constructor(children: TokenNode[]) {
        super(children);
    }
}