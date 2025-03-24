import {AbstractContainerNode} from "../../core/TreeNode";
import {TokenNode} from "./TokenNode";

export class TokenLineNode extends AbstractContainerNode<TokenNode> {

    static Height : number = 19

    type: string = "token-line"

    constructor(children: TokenNode[]) {
        super(children);
    }
}