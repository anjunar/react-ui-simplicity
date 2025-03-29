import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";

export class ListNode extends AbstractContainerNode<ItemNode> {

    constructor(children: ItemNode[] = []) {
        super(children);
    }
}

export class ItemNode extends AbstractContainerNode<AbstractNode> {

    constructor(children: AbstractNode[] = []) {
        super(children);
    }
}