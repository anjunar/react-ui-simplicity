import {AbstractCommand} from "./AbstractCommand";
import {TextNode} from "../ast/TreeNode";
import {Context} from "../components/EditorContext";
import {over, partial} from "./Commands";

export abstract class AbstractFormatCommand extends AbstractCommand<boolean> {

    abstract get format(): string;

    execute(value: boolean, context: Context): void {

        const {ast: {root, triggerAST}, cursor: {currentCursor}, selection: {currentSelection, triggerSelection}} = context

        if (currentSelection) {

            if (currentSelection.startContainer === currentSelection.endContainer) {
                let container = currentSelection.startContainer;

                if (container instanceof TextNode) {
                    let textNode = partial(currentSelection);
                    textNode[this.format] = value
                }
            } else {
                let nodes = over(currentSelection, root);

                for (const node of nodes) {
                    if (node instanceof TextNode) {
                        node[this.format] = value;
                    }
                }

            }

            triggerSelection()

        } else {
            if (currentCursor && currentCursor.container instanceof TextNode) {
                currentCursor.container[this.format] = value
            }
        }

        triggerAST()

    }

}