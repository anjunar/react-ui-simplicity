import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, ParagraphNode, TextNode} from "../../core/TreeNode";
import {Context} from "../../EditorContext";
import {TableCellNode, TableNode, TableRowNode} from "./TableNode";

export class TableCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: Context) {

        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let textNode = new TextNode();

        grandParent.insertChild(index + 1, new TableNode([new TableRowNode([new TableCellNode([new ParagraphNode([textNode])]), new TableCellNode([new ParagraphNode([new TextNode()])])])]))

        context.cursor.currentCursor.container = textNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()


    }
}