import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {Context} from "../../EditorContext";
import {FlexNode} from "./FlexNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";

export class FlexCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let textNode = new TextNode("");
        let flexNode = new FlexNode([new ParagraphNode([textNode]), new ParagraphNode([new TextNode("")])])

        grandParent.insertChild(index + 1, flexNode)

        context.cursor.currentCursor.container = textNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}