import {AbstractCommand} from "../../commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {CodeNode} from "./CodeNode";
import EditorState from "../../contexts/EditorState";
import {TokenNode} from "./TokenNode";
import {TokenLineNode} from "./TokenLineNode";

export class CodeCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: EditorState.Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let tokenNode = new TokenNode("", "text", 0);
        let codeNode = new CodeNode([new TokenLineNode([tokenNode])]);

        grandParent.insertChild(index + 1, codeNode)

        context.cursor.currentCursor.container = tokenNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}