import {AbstractNode, HeadingNode, ParagraphNode} from "../core/TreeNode";
import {AbstractBlockCommand} from "./Command";

export class BlockCommand extends AbstractBlockCommand {
    get callback(): (value: string, container: AbstractNode[]) => void {
        return (value: string, container: AbstractNode[]) => {

            let parent = container[0].parent;
            if (value.startsWith("h")) {
                let headingNode = new HeadingNode(container);
                headingNode.level = value
                parent.replaceWith(headingNode)
            }
            if (value.startsWith("p")) {
                let paragraphNode = new ParagraphNode(container);
                parent.replaceWith(paragraphNode)
            }

        }
    }

}