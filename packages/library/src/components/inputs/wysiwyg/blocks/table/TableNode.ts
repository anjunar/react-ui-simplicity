import {AbstractNode} from "../shared/AbstractNode";

export class TableBlock {

}

export class TableNode extends AbstractNode<TableBlock> {

    type: string = "table"

    data: TableBlock;

    get isEmpty(): any {
        return false
    }

    constructor(data: TableBlock) {
        super();
        this.data = data;
    }
}