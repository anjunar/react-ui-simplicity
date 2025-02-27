import {AbstractNode} from "../shared/AbstractNode";

export class TextBlock {

    text : string

    constructor(text: string) {
        this.text = text;
    }
}

export class ParagraphNode extends AbstractNode<TextBlock> {

    type: string = "paragraph"

    data: TextBlock

    get isEmpty() {
        return this.data.text === "<p><span><br></span></p>"
    }

    constructor(data: TextBlock) {
        super();
        this.data = data;
    }
}