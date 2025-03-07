import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";

export class ListNode extends AbstractContainerNode<ItemNode> {
    type: string = "list";


    constructor(children: ItemNode[] = []) {
        super(children);
    }
}

export class ItemNode extends AbstractContainerNode<AbstractNode> {
    type: string = "item";


    constructor(children: AbstractNode[] = []) {
        super(children);
    }
}