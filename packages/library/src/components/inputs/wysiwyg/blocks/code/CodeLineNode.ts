import {AbstractNode} from "../../core/TreeNode";

export class CodeLineNode extends AbstractNode {
    type: string = "code-block"

    text : string

    constructor(source: string) {
        super();
        this.text = source;
    }
}