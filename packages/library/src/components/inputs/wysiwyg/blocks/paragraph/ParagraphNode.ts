import {AbstractNode} from "../shared/AbstractNode";
import {AbstractTreeNode, RootTreeNode} from "../text/core/TreeNode";
import {Context} from "../text/EditorContext";

export class TextBlock {

    text: AbstractTreeNode

    context: Context

    constructor(text: AbstractTreeNode) {
        this.text = text;
    }
}

export class ParagraphNode extends AbstractNode<TextBlock> {

    type: string = "paragraph"

    data: TextBlock

    get isEmpty() {
        return false
    }

    constructor(data: TextBlock = new TextBlock(new RootTreeNode())) {
        super();
        this.data = data;
    }
}