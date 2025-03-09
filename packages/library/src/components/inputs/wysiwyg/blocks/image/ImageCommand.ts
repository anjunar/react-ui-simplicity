import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode} from "../../core/TreeNode";
import {ImageNode} from "./ImageNode";
import {Context} from "../../EditorState";

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