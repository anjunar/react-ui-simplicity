import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";

export class ListNode extends AbstractContainerNode {
    type: string = "list";


    constructor(children: AbstractNode[] = []) {
        super(children);
    }
}

export class ItemNode extends AbstractContainerNode {
    type: string = "item";


    constructor(children: AbstractNode[] = []) {
        super(children);
    }
}