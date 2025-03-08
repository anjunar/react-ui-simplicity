import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {ItemNode, ListNode} from "./ListNode";
import {Context} from "../../EditorContext";
import {ParagraphNode} from "../paragraph/ParagraphNode";

export class ListCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: Context) {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let textNode = new TextNode();

        grandParent.insertChild(index + 1, new ListNode([new ItemNode([new ParagraphNode([textNode])],)]))

        context.cursor.currentCursor.container = textNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }
}