import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";

export class FlexNode extends AbstractContainerNode<AbstractNode> {
    type = "flex"

    constructor(children: AbstractNode[] = []) {
        super(children);
    }
}