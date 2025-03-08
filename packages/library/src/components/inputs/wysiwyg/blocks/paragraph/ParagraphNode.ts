import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";

export class ParagraphNode extends AbstractContainerNode<AbstractNode> {
    readonly type: string = "p"

    constructor(children: AbstractNode[]= []) {
        super(children);
    }

}

