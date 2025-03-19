import {AbstractContainerNode} from "../../core/TreeNode";
import {CodeLineNode} from "./CodeLineNode";

export class CodeNode extends AbstractContainerNode<CodeLineNode> {
    type: string = "code"

    constructor(children: CodeLineNode[]) {
        super(children);
    }
}