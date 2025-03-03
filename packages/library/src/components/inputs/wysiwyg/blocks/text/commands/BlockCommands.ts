import {AbstractTreeNode, HeadingTreeNode, ParagraphTreeNode} from "../core/TreeNode";
import {AbstractBlockCommand} from "./AbstractCommands";

export class BlockCommand extends AbstractBlockCommand {
    get callback(): (value: string, container: AbstractTreeNode[]) => void {
        return (value: string, nodes: AbstractTreeNode[]) => {

            let parent = nodes[0].parent;
            if (value.startsWith("h")) {
                let headingNode = new HeadingTreeNode(nodes);
                headingNode.level = value
                parent.replaceWith(headingNode)
            }
            if (value.startsWith("p")) {
                let paragraphNode = new ParagraphTreeNode(nodes);
                parent.replaceWith(paragraphNode)
            }

        }
    }

}