import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";

export class BoxNode extends AbstractContainerNode<AbstractNode> {
    type = "box"

    constructor(children: AbstractNode[] = []) {
        super(children);
    }
}

export class FlexNode extends AbstractContainerNode<BoxNode> {
    type = "flex"

    justifyContent = "flex-start"
    alignItems = "flex-start"

    constructor(children: BoxNode[] = []) {
        super(children);
    }
}