import {AbstractCommand} from "./AbstractCommand";
import {Context, SelectionState, selectionState} from "../components/EditorContext";
import {AbstractContainerNode, AbstractNode, HeadingNode, ParagraphNode, TextNode} from "../ast/TreeNode";
import {over, partial, splitIntoContainers} from "./Commands";

function extracted(value: string, context: Context) {
}

export abstract class AbstractBlockCommand extends AbstractCommand<string> {

    abstract get callback(): (value: string, containers : AbstractNode[]) => void;

    execute(value: string, context: Context): void {

        let state = selectionState(context.selection.currentSelection)

        const {ast: {root, triggerAST}, cursor: {currentCursor}, selection: {currentSelection, triggerSelection}} = context

        switch (state) {
            case SelectionState.full : {
                this.callback(value, [currentSelection.startContainer])
            } break;
            case SelectionState.partial : {
                let textNode = partial(currentSelection);

                splitIntoContainers(textNode)

                this.callback(value, [textNode])

                currentSelection.startContainer = textNode;
                currentSelection.endContainer = textNode;
                currentSelection.startOffset = 0
                currentSelection.endOffset = textNode.text.length

            } break
            case SelectionState.over : {
                let abstractNodes = over(currentSelection, root);

                let startContainer = abstractNodes[0] as TextNode
                let endContainer = abstractNodes[abstractNodes.length - 1] as TextNode

                splitIntoContainers(startContainer)
                splitIntoContainers(endContainer)

                this.callback(value, abstractNodes.filter(node => node instanceof TextNode))

                abstractNodes.forEach(node => {
                    if (! (node instanceof TextNode)) {
                        node.remove()
                    }
                })

                currentSelection.startContainer = startContainer
                currentSelection.endContainer = endContainer
                currentSelection.startOffset = 0
                currentSelection.endOffset = endContainer.text.length


            } break
            case SelectionState.none : {
                this.callback(value, [currentCursor.container])
            }
        }

        triggerAST()
        triggerSelection()


    }

}