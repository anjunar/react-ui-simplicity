import {AbstractCommand} from "../../../wysiwyg/commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import WysiwygState from "../../contexts/WysiwygState";
import {CodeNode} from "./CodeNode";

export class CodeCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: WysiwygState.Context): void {
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