import {AbstractCommand} from "../../../wysiwyg/commands/AbstractCommands";
import {AbstractNode, TextNode} from "../../core/TreeNode";
import {BoxNode, FlexNode} from "./FlexNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import WysiwygState from "../../contexts/WysiwygState";

export class FlexCommand extends AbstractCommand<AbstractNode> {
    execute(node: AbstractNode, context: WysiwygState.Context): void {
        let parent = node.parent;
        let index = parent.parentIndex
        let grandParent = parent.parent;

        let textNode = new TextNode("");
        let flexNode = new FlexNode([new BoxNode([new ParagraphNode([textNode])]), new BoxNode([new ParagraphNode([new TextNode("")])])] )

        grandParent.insertChild(index + 1, flexNode)

        context.cursor.currentCursor.container = textNode
        context.cursor.currentCursor.offset = 0
        context.cursor.triggerCursor()
    }

}