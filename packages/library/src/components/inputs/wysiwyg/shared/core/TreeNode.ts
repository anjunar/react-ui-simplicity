import {v4} from "uuid";
import {flatten} from "./TreeNodes";
import {NodeRange} from "../../markdown/selection/ASTSelection";
import {membrane} from "./Membrane";

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
            let indexOf = this.parent.children.indexOf(this);
            this.parent.children.splice(indexOf, 1)
        }
    }

    after(node : AbstractNode) {
        let index = this.parentIndex;
        let parent = this.parent
        parent.children.splice(index + 1, 1, node)
    }

}

export abstract class AbstractContainerNode<C extends AbstractNode> extends AbstractNode {

    readonly children : C[] = membrane([], this)

    justify : string

    protected constructor(children: C[]) {
        super();
        this.children.push(...children)
    }

    appendChild(node: C) {
        this.children.push(node);
    }

    insertChild(index: number, node: C) {
        this.children.splice(index, 0, node)
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

    markdown : NodeRange = {node : this, start : -1, end : -1}

    constructor(text: string = "") {
        super();
        this.text = text;
    }

    hasFormat(except : string[] = []) {
        const whiteList = ["bold", "italic", "deleted", "sub", "sup"]

        for (const string of except) {
            let indexOf = whiteList.indexOf(string);
            whiteList.splice(indexOf, 1)
        }

        return whiteList.some(item => this[item])

    }

}

