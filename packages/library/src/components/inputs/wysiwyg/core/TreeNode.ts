import {v4} from "uuid";
import {flatten} from "./TreeNodes";

function resolveVariable(value : string) {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue(value).trim();
}

export abstract class AbstractNode {
    id : string = v4()
    abstract type : string
    dom : Node
    parent: AbstractContainerNode<any>;

    get nextSibling(): AbstractNode {
        if (!this.parent) return null;
        const index = this.parent.children.indexOf(this);
        return index >= 0 && index < this.parent.children.length - 1 ? this.parent.children[index + 1] : null;
    }

    get prevSibling(): AbstractNode {
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

export abstract class AbstractContainerNode<C extends AbstractNode> extends AbstractNode {

    private readonly _children : C[] = []

    justify : string

    protected constructor(children: C[]) {
        super();
        children.forEach(child => {
            this.appendChild(child)
        })
    }

    appendChild(node: C) {
        node.remove()
        node.parent = this;
        this._children.push(node);
    }

    removeChild(node: C) {
        node.parent = null;
        const index = this._children.indexOf(node)
        if (index >= 0) {
            this._children.splice(index, 1)
        }
    }

    insertChild(index: number, node: C) {
        node.remove()
        node.parent = this
        this._children.splice(index, 0, node)
    }

    replaceWith(heading: C) {
        const parent = this.parent;
        const index = this.parentIndex;
        if (parent && index >= 0) {
            parent.removeChild(this);
            parent.insertChild(index, heading);
        }
    }

    get children(): ReadonlyArray<C> {
        return this._children;
    }

}

export class RootNode extends AbstractContainerNode<AbstractNode> {
    readonly type: string = "root"

    constructor(children: AbstractNode[] = []) {
        super(children);
    }

    get flatten() : AbstractNode[] {
        return flatten(this)
    }

}

export class ParagraphNode extends AbstractContainerNode<AbstractNode> {
    readonly type: string = "p"

    constructor(children: AbstractNode[]= []) {
        super(children);
    }

}

export class TextNode extends AbstractNode {

    readonly type: string = "text"

    block : "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" = "p"

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

    constructor(text: string = "") {
        super();
        this.text = text;
    }

}

