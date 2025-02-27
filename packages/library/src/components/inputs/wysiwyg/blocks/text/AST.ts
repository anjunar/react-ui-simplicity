import {v4} from "uuid";

export class AbstractTreeNode {
    id : string = v4()
}

export class TextTreeNode extends AbstractTreeNode {

    text : string = ""

    bold : boolean

    italic : boolean

    deleted : boolean

    sup : boolean

    sub : boolean

}

export class ParagraphTreeNode extends AbstractTreeNode {

    children : AbstractTreeNode[]

}
