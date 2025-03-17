import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {ItemNode, ListNode} from "./ListNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import EditorState from "../../contexts/EditorState";

export class ListCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: EditorState.Context) {
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