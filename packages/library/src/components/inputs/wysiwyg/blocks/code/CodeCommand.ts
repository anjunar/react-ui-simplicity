import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {CodeNode} from "./CodeNode";
import EditorState from "../../contexts/EditorState";
import {CodeLineNode} from "./CodeLineNode";

export class CodeCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: EditorState.Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let codeBlock = new CodeLineNode("")
        let codeNode = new CodeNode([codeBlock]);

        grandParent.insertChild(index + 1, codeNode)

        context.cursor.currentCursor.container = codeBlock
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}