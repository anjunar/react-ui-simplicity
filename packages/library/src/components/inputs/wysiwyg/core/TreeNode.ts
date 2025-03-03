import {v4} from "uuid";
import {flatten} from "./TreeNodes";

function resolveVariable(value : string) {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue(value).trim();
}

export abstract class AbstractNode {
    id : string = v4()
    abstract type : string
    dom : HTMLElement
    parent: AbstractContainerNode;

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

export abstract class AbstractContainerNode extends AbstractNode {

    private readonly _children : AbstractNode[] = []

    protected constructor(children: AbstractNode[]) {
        super();
        children.forEach(child => {
            this.appendChild(child)
        })
    }

    abstract newInstance() : AbstractContainerNode

    appendChild(node: AbstractNode) {
        node.remove()
        node.parent = this;
        this._children.push(node);
    }

    removeChild(node: AbstractNode) {
        node.parent = null;
        const index = this._children.indexOf(node)
        if (index >= 0) {
            this._children.splice(index, 1)
        }
    }

    insertChild(index: number, node: AbstractNode) {
        node.remove()
        node.parent = this
        this._children.splice(index, 0, node)
    }

    replaceWith(heading: AbstractNode) {
        const parent = this.parent;
        const index = this.parentIndex;
        if (parent && index >= 0) {
            parent.removeChild(this);
            parent.insertChild(index, heading);
        }
    }

    get children(): ReadonlyArray<AbstractNode> {
        return this._children;
    }

}

export class RootNode extends AbstractContainerNode {
    readonly type: string = "root"

    constructor(children: AbstractNode[] = []) {
        super(children);
    }

    newInstance(): AbstractContainerNode {
        return new RootNode()
    }

    get flatten() : AbstractNode[] {
        return flatten(this)
    }

}

export class ParagraphNode extends AbstractContainerNode {
    readonly type: string = "p"

    constructor(children: AbstractNode[]= []) {
        super(children);
    }

    newInstance(): AbstractContainerNode {
        return new ParagraphNode()
    }

}

export class HeadingNode extends AbstractContainerNode {
    readonly type: string = "heading"
    level : string = "h1"

    constructor(children: AbstractNode[] = []) {
        super(children);
    }

    newInstance(): AbstractContainerNode {
        return new HeadingNode()
    }


}

export class TextNode extends AbstractNode {

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

