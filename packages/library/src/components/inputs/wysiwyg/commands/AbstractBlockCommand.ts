import {AbstractCommand} from "./AbstractCommand";
import {Context, SelectionState, selectionState} from "../components/EditorContext";
import {AbstractNode, TextNode} from "../ast/TreeNode";
import {over, partial, splitIntoContainers} from "./Commands";

function updateSelection(
    selection: {
        startContainer: AbstractNode,
        endContainer: AbstractNode,
        startOffset: number,
        endOffset: number
    },
    startContainer: TextNode,
    endContainer: TextNode
): void {
    selection.startContainer = startContainer;
    selection.endContainer = endContainer;
    selection.startOffset = 0;
    selection.endOffset = endContainer.text.length;
}

abstract class SelectionStateHandler {
    abstract handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractNode[]) => void
    ): void;
}

class FullSelectionStateHandler extends SelectionStateHandler {
    handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractNode[]) => void
    ): void {
        const {currentSelection} = context.selection;

        if (currentSelection.startContainer instanceof TextNode) {
            splitIntoContainers(currentSelection.startContainer);
            callback(value, [currentSelection.startContainer]);
        }
    }
}

class PartialSelectionStateHandler extends SelectionStateHandler {
    handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractNode[]) => void
    ): void {
        const {currentSelection} = context.selection;

        let textNode = partial(currentSelection);
        splitIntoContainers(textNode);
        callback(value, [textNode]);

        updateSelection(currentSelection, textNode, textNode)
    }
}

class OverSelectionStateHandler extends SelectionStateHandler {
    handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractNode[]) => void
    ): void {
        const {ast: {root}, selection: {currentSelection}} = context;

        let abstractNodes = over(currentSelection, root);

        let startContainer = abstractNodes[0] as TextNode
        let endContainer = abstractNodes[abstractNodes.length - 1] as TextNode

        splitIntoContainers(startContainer)
        splitIntoContainers(endContainer)

        callback(value, abstractNodes.filter(node => node instanceof TextNode))

        abstractNodes.forEach(node => {
            if (!(node instanceof TextNode)) {
                node.remove()
            }
        })

        updateSelection(currentSelection, startContainer, endContainer)

    }
}

class NoneSelectionStateHandler extends SelectionStateHandler {
    handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractNode[]) => void
    ): void {
        const {currentCursor} = context.cursor;

        splitIntoContainers(currentCursor.container as TextNode)

        callback(value, [currentCursor.container])
    }
}

const stateHandlers: Map<SelectionState, SelectionStateHandler> = new Map();

stateHandlers.set(SelectionState.full, new FullSelectionStateHandler());
stateHandlers.set(SelectionState.partial, new PartialSelectionStateHandler());
stateHandlers.set(SelectionState.over, new OverSelectionStateHandler());
stateHandlers.set(SelectionState.none, new NoneSelectionStateHandler());


export abstract class AbstractBlockCommand extends AbstractCommand<string> {

    abstract get callback(): (value: string, containers: AbstractNode[]) => void;

    execute(value: string, context: Context): void {
        const {ast : {triggerAST}, selection : {triggerSelection}} = context;
        const state = selectionState(context.selection.currentSelection);
        const handler = stateHandlers.get(state);

        if (!handler) {
            throw new Error(`No handler found for state: ${state}`);
        }

        handler.handle(value, context, this.callback);

        triggerAST();
        triggerSelection();
    }

}