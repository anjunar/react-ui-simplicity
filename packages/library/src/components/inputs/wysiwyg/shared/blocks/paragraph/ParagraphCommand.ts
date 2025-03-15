import {AbstractCommand} from "../../../wysiwyg/commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {ParagraphNode} from "./ParagraphNode";
import WysiwygState from "../../contexts/WysiwygState";

export class ParagraphCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: WysiwygState.Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let textNode = new TextNode("")

        grandParent.insertChild(index + 1, new ParagraphNode([textNode]))

        context.cursor.currentCursor.container = textNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}