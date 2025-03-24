import {AbstractContainerNode, AbstractNode, TextNode} from "../../core/TreeNode";

export class ParagraphNode extends AbstractContainerNode<TextNode> {
    readonly type: string = "p"

    constructor(children: TextNode[]= []) {
        super(children);

        let superProperty = this.domHeight


        Object.defineProperty(this, "domHeight", {
            configurable : true,
            get(): number {
                return superProperty + this.children.reduce((prev, curr) => prev + curr.domHeight, 0)
            }
        })

    }

    mergeAdjacentTextNodes() {
        if (this.children.length < 2) return;

        let newChildren: TextNode[] = [];
        let lastNode: TextNode | null = null;

        for (let node of this.children) {
            if (lastNode instanceof TextNode && node instanceof TextNode) {
                if (
                    lastNode.bold === node.bold &&
                    lastNode.italic === node.italic &&
                    lastNode.deleted === node.deleted &&
                    lastNode.sup === node.sup &&
                    lastNode.sub === node.sub &&
                    lastNode.fontFamily === node.fontFamily &&
                    lastNode.fontSize === node.fontSize &&
                    lastNode.color === node.color &&
                    lastNode.backgroundColor === node.backgroundColor
                ) {
                    lastNode.text += node.text;
                    continue;
                }
            }

            newChildren.push(node);
            lastNode = node;
        }

        if (newChildren.length > 0) {
            for (const child of Array.from(this.children)) {
                child.remove()
            }

            for (const newChild of newChildren) {
                this.appendChild(newChild)
            }
        }
    }
}

