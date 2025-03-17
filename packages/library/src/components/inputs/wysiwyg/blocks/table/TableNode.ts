import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";

export class TableCellNode extends AbstractContainerNode<AbstractNode> {
    type: string = "td";


    constructor(children: AbstractNode[]) {
        super(children);
    }
}

export class TableRowNode extends AbstractContainerNode<TableCellNode> {
    type: string = "tr";


    constructor(children: TableCellNode[]) {
        super(children);
    }
}

export class TableNode extends AbstractContainerNode<TableRowNode> {
    type: string = "table";

    rows : number = 1
    cols : number = 2

    constructor(children: TableRowNode[]) {
        super(children);
    }

}