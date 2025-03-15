import {TextNode} from "../../shared/core/TreeNode";
import {over, partial} from "../utils/SelectionUtils";
import WysiwygState from "../../shared/contexts/WysiwygState";
import EditorState from "../../shared/contexts/EditorState";

export abstract class AbstractCommand<E> {
    abstract execute(value: E, context: WysiwygState.Context, editor : EditorState.Context): void;
}

export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    abstract get format(): string;

    execute(value: E, context: WysiwygState.Context, editor : EditorState.Context): void {

        const {cursor: {currentCursor, triggerCursor}, selection: {currentSelection, triggerSelection}} = context

        const {ast : {root, triggerAST}} = editor

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
                triggerCursor()
            }
        }

        triggerAST()

    }
}