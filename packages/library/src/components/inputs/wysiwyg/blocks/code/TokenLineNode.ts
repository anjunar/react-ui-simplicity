import {AbstractContainerNode} from "../../core/TreeNode";
import {TokenNode} from "./TokenNode";

export class TokenLineNode extends AbstractContainerNode<TokenNode> {

    type: string = "token-line"

    constructor(children: TokenNode[]) {
        super(children);

        Object.defineProperty(this, "domHeight", {
            get(): number {
                return this.children.reduce((prev, curr) => prev = Math.max(curr.domHeight, prev), 0)
            }
        })

    }
}