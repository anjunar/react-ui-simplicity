import {AbstractContainerNode} from "../../core/TreeNode";
import {TokenLineNode} from "./TokenLineNode";
import Prism from "prismjs";
import {TokenNode} from "./TokenNode";
import {groupTokensIntoLines, tokenDiff, toTokenNodes} from "./CodeUtils";
import {findNode} from "../../core/TreeNodes";

export class CodeNode extends AbstractContainerNode<TokenLineNode> {
    type: string = "code"

    text: string = ""

    constructor(children: TokenLineNode[]) {
        super(children);
    }

    updateText(newText: string, partText : string, index : number) : [TokenNode, number] {
        this.text = newText

        let tokens = Prism.tokenize(this.text, Prism.languages.typescript)

        let nodes = toTokenNodes(tokens);

        let tokenLineNodes = groupTokensIntoLines(nodes);

        let tokenDiffer = tokenDiff(this.children, tokenLineNodes);

        this.children.length = 0
        this.children.push(...tokenDiffer)

        let foundNode = findNode(this, node => {
            if (node instanceof TokenNode && node.type !== "whitespace") {
                if (node.index <= index && index <= (node.index + (node.text.length === 0 ? 1 : node.text.length))) {
                    // @ts-ignore
                    if (node.text.includes(partText)) {
                        return true
                    }
                }
            }
            return false
        });

        if (!foundNode) {
            foundNode = findNode(this, node => {
                if (node instanceof TokenNode) {
                    if (node.index <= index && index <= (node.index + (node.text.length === 0 ? 1 : node.text.length))) {
                        // @ts-ignore
                        if (node.text.includes(partText)) {
                            return true
                        }
                    }
                }
                return false
            });
        }

        if (foundNode) {
            return [foundNode, index - foundNode.index]
        }

        return null
    }
}