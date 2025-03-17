import {AbstractNode} from "../../core/TreeNode";

export class CodeNode extends AbstractNode {
    type: string = "code"

    source: string = "let a = 1"

}