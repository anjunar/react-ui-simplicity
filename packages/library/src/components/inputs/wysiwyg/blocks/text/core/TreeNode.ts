import {v4} from "uuid";
import {flatten} from "./TreeNodes";

export abstract class AbstractTreeNode {
    id : string = v4()
    abstract type : string
    dom : HTMLElement
    parent: AbstractContainerTreeNode;

    get nextSibling(): AbstractTreeNode {
        if (!this.parent) return null;
        const index = this.parent.children.indexOf(this);
        return index >= 0 && index < this.parent.children.length - 1 ? this.parent.children[index + 1] : null;
    }

    get prevSibling(): AbstractTreeNode {
        if (!this.parent) return null;
        const index = this.parent.children.indexOf(this);
        return index > 0 ? this.parent.children[index - 1] : null;
    }

    get parentIndex() : number {
        if (this.parent) {
            return this.parent.children.indexOf(this)
        }
        return -1
    }

    remove() {
        if (this.parent) {
            return this.parent.removeChild(this)
        }
    }

}

export abstract class AbstractContainerTreeNode extends AbstractTreeNode {

    private readonly _children : AbstractTreeNode[] = []

    protected constructor(children: AbstractTreeNode[]) {
        super();
        children.forEach(child => {
            this.appendChild(child)
        })
    }

    abstract newInstance() : AbstractContainerTreeNode

    appendChild(node: AbstractTreeNode) {
        node.remove()
        node.parent = this;
        this._children.push(node);
    }

    removeChild(node: AbstractTreeNode) {
        node.parent = null;
        const index = this._children.indexOf(node)
        if (index >= 0) {
            this._children.splice(index, 1)
        }
    }

    insertChild(index: number, node: AbstractTreeNode) {
        node.remove()
        node.parent = this
        this._children.splice(index, 0, node)
    }

    replaceWith(heading: AbstractTreeNode) {
        const parent = this.parent;
        const index = this.parentIndex;
        if (parent && index >= 0) {
            parent.removeChild(this);
            parent.insertChild(index, heading);
        }
    }

    get children(): ReadonlyArray<AbstractTreeNode> {
        return this._children;
    }

}

export class RootTreeNode extends AbstractContainerTreeNode {
    readonly type: string = "root"

    constructor(children: AbstractTreeNode[] = []) {
        super(children);
    }

    newInstance(): AbstractContainerTreeNode {
        return new RootTreeNode()
    }

    get flatten() : AbstractTreeNode[] {
        return flatten(this)
    }

}

export class ParagraphTreeNode extends AbstractContainerTreeNode {
    readonly type: string = "p"

    constructor(children: AbstractTreeNode[]= []) {
        super(children);
    }

    newInstance(): AbstractContainerTreeNode {
        return new ParagraphTreeNode()
    }

}

export class HeadingTreeNode extends AbstractContainerTreeNode {
    readonly type: string = "heading"
    level : string = "h1"

    constructor(children: AbstractTreeNode[] = []) {
        super(children);
    }

    newInstance(): AbstractContainerTreeNode {
        return new HeadingTreeNode()
    }


}

export class TextTreeNode extends AbstractTreeNode {

    readonly type: string = "text"

    text : string = ""

    bold : boolean = false

    italic : boolean = false

    deleted : boolean = false

    sup : boolean = false

    sub : boolean = false

    fontFamily : string = ""

    fontSize : string = ""

    color : string = ""

    backgroundColor : string = ""

    constructor(text: string) {
        super();
        this.text = text;
    }

}

