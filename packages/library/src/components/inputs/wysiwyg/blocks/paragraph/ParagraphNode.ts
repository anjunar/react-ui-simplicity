import {AbstractNode} from "../shared/AbstractNode";
import {AbstractTreeNode} from "../text/ast/TreeNode";

export class TextBlock {

    text : AbstractTreeNode

    constructor(text: AbstractTreeNode) {
        this.text = text;
    }
}

export class ParagraphNode extends AbstractNode<TextBlock> {

    type: string = "paragraph"

    data: TextBlock

    get isEmpty() {
        return this.data.text.length === 0
    }

    constructor(data: TextBlock) {
        super();
        this.data = data;
    }
}