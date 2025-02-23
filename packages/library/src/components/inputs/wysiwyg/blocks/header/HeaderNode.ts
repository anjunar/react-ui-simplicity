import {AbstractNode} from "../AbstractNode";

export class HeaderBlock {

    text : string

    constructor(text: string) {
        this.text = text;
    }
}

export class HeaderNode extends AbstractNode<HeaderBlock> {

    type: string = "header"

    data: HeaderBlock

    get isEmpty() {
        return this.data.text.length === 0
    }

    constructor(data: HeaderBlock) {
        super();
        this.data = data;
    }
}