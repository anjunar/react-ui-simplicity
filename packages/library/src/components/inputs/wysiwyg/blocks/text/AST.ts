import {v4} from "uuid";

export abstract class AbstractTreeNode {
    id : string = v4()
    abstract type : string
    dom : HTMLElement
}

export abstract class AbstractContainerTreeNode extends AbstractTreeNode {
    children : AbstractTreeNode[] = []

    protected constructor(children: AbstractTreeNode[]) {
        super();
        this.children = children;
    }
}

export class RootTreeNode extends AbstractContainerTreeNode {
    type: string = "root"

    constructor(children: AbstractTreeNode[]= []) {
        super(children);
    }
}


export class ParagraphTreeNode extends AbstractContainerTreeNode {

    type: string = "p"

    constructor(children: AbstractTreeNode[] = []) {
        super(children);
    }
}

export class TextTreeNode extends AbstractTreeNode {

    type: string = "text"

    text : string = ""

    bold : boolean

    italic : boolean

    deleted : boolean

    sup : boolean

    sub : boolean


    constructor(text: string) {
        super();
        this.text = text;
    }
}

