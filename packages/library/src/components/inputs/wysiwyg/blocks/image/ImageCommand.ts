import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode} from "../../core/TreeNode";
import {Context} from "../../EditorContext";
import {ImageNode} from "./ImageNode";

export class ImageCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let imageNode = new ImageNode

        grandParent.insertChild(index + 1, imageNode)

        context.cursor.currentCursor.container = imageNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}