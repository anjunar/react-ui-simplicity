import {AbstractNode, HeadingNode, ParagraphNode} from "../core/TreeNode";
import {AbstractBlockCommand} from "./AbstractCommands";

export class BlockCommand extends AbstractBlockCommand {
    get callback(): (value: string, container: AbstractNode[]) => void {
        return (value: string, nodes: AbstractNode[]) => {

            let parent = nodes[0].parent;
            if (value.startsWith("h")) {
                let headingNode = new HeadingNode(nodes);
                headingNode.level = value
                parent.replaceWith(headingNode)
            }
            if (value.startsWith("p")) {
                let paragraphNode = new ParagraphNode(nodes);
                parent.replaceWith(paragraphNode)
            }

        }
    }

}