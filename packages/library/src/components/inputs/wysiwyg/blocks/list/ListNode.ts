import {AbstractNode} from "../AbstractNode";

export class ListData {

    type = "unordered"

    items : string[]  = []

}

export class ListNode extends AbstractNode<ListData> {

    type: string = "list"
    data: ListData;

    get isEmpty(): any {
        return this.data.items.length === 0
    }

    constructor(data: ListData) {
        super();
        this.data = data;
    }
}