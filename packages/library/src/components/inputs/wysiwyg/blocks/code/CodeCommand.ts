import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {CodeNode} from "./CodeNode";
import EditorState from "../../contexts/EditorState";

export class CodeCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: EditorState.Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let codeNode = new CodeNode();

        grandParent.insertChild(index + 1, codeNode)

        context.cursor.currentCursor.container = codeNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}