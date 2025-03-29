import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";

export class TableCellNode extends AbstractContainerNode<AbstractNode> {

    constructor(children: AbstractNode[]) {
        super(children);
    }
}

export class TableRowNode extends AbstractContainerNode<TableCellNode> {

    constructor(children: TableCellNode[]) {
        super(children);
    }
}

export class TableNode extends AbstractContainerNode<TableRowNode> {
    rows : number = 1
    cols : number = 2

    constructor(children: TableRowNode[]) {
        super(children);
    }

}