import {AbstractContainerNode} from "../../core/TreeNode";
import {TokenNode} from "./TokenNode";
import Basic from "../../../../../mapper/annotations/Basic";
import Entity from "../../../../../mapper/annotations/Entity";

@Entity("TokenLineNode")
export class TokenLineNode extends AbstractContainerNode<TokenNode> {

    readonly children: TokenNode[];

    constructor(children: TokenNode[]) {
        super(children);
    }
}