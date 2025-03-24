import {v4} from "uuid";
import {flatten} from "./TreeNodes";
import {membrane} from "./Membrane";
import {node} from "webpack";

function getOuterHeightWithMargin(element : HTMLElement) {
    const style = window.getComputedStyle(element);
    const marginTop = parseFloat(style.marginTop) || 0
    const marginBottom = parseFloat(style.marginBottom) || 0
    return (element.offsetHeight) + ((marginBottom + marginTop));
}

export abstract class AbstractNode {
    abstract type : string

    id : string = v4()
    dom : Node
    parent: AbstractContainerNode<any>;
    domHeight : number

    constructor() {

        let domHeight = 0
        let currentDomHeight = 0

        Object.defineProperty(this, "domHeight", {
            configurable : true,
            set(value : number) {
              domHeight = value
            },
            get(): number {

                if (this.dom instanceof HTMLElement) {
                    currentDomHeight = getOuterHeightWithMargin(this.dom)
                } else {
                    if (this.dom instanceof Node) {
                        currentDomHeight = getOuterHeightWithMargin(this.dom.parentElement)
                    } else {
                        currentDomHeight = 0
                    }
                }

                if (currentDomHeight > 0 && domHeight > 0 && currentDomHeight !== domHeight) {
                    domHeight = currentDomHeight
                    return domHeight
                }

                if (domHeight === 0) {
                    if (this.dom instanceof HTMLElement) {
                        domHeight = getOuterHeightWithMargin(this.dom)
                    } else {
                        if (this.dom instanceof Node) {
                            domHeight = getOuterHeightWithMargin(this.dom.parentElement)
                        } else {
                            domHeight = 0
                        }
                    }
                }
                return domHeight
            }
        })

    }

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

    readonly children : C[]

    justify : string

    protected constructor(children: C[]) {
        super();

        let membraneArray = membrane([], this);

        Object.defineProperty(this, "children", {
            get(): any {
                return membraneArray
            }
        })

        Object.defineProperty(this, "domHeight", {
            configurable : true,
            get(): number {
                return this.children.reduce((prev, curr) => prev + curr.domHeight, 0)
            }
        })

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

    constructor(text: string = "") {
        super();
        this.text = text;
    }

}

