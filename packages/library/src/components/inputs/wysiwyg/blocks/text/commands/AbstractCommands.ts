import {Context, selectionState, SelectionState} from "../EditorContext";
import {AbstractTreeNode, TextTreeNode} from "../core/TreeNode";
import {over, partial, splitIntoContainers} from "../utils/SelectionUtils";

export abstract class AbstractCommand<E> {
    abstract execute(value: E, context: Context): void;
}

function updateSelection(
    selection: {
        startContainer: AbstractTreeNode,
        endContainer: AbstractTreeNode,
        startOffset: number,
        endOffset: number
    },
    startContainer: TextTreeNode,
    endContainer: TextTreeNode
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
        callback: (value: string, containers: AbstractTreeNode[]) => void
    ): void;
}

export class FullSelectionStateHandler extends SelectionStateHandler {
    handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractTreeNode[]) => void
    ): void {
        const {currentSelection} = context.selection;

        if (currentSelection.startContainer instanceof TextTreeNode) {
            splitIntoContainers(currentSelection.startContainer);
            callback(value, [currentSelection.startContainer]);
        }
    }
}

export class PartialSelectionStateHandler extends SelectionStateHandler {
    handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractTreeNode[]) => void
    ): void {
        const {currentSelection} = context.selection;

        let textNode = partial(currentSelection);
        splitIntoContainers(textNode);
        callback(value, [textNode]);

        updateSelection(currentSelection, textNode, textNode)
    }
}

export class OverSelectionStateHandler extends SelectionStateHandler {
    handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractTreeNode[]) => void
    ): void {
        const {ast: {root}, selection: {currentSelection}} = context;

        let abstractNodes = over(currentSelection, root);

        let startContainer = abstractNodes[0] as TextTreeNode
        let endContainer = abstractNodes[abstractNodes.length - 1] as TextTreeNode

        splitIntoContainers(startContainer)
        splitIntoContainers(endContainer)

        callback(value, abstractNodes.filter(node => node instanceof TextTreeNode))

        abstractNodes.forEach(node => {
            if (!(node instanceof TextTreeNode)) {
                node.remove()
            }
        })

        updateSelection(currentSelection, startContainer, endContainer)

    }
}

export class NoneSelectionStateHandler extends SelectionStateHandler {
    handle(
        value: string,
        context: Context,
        callback: (value: string, containers: AbstractTreeNode[]) => void
    ): void {
        const {currentCursor} = context.cursor;

        splitIntoContainers(currentCursor.container as TextTreeNode)

        callback(value, [currentCursor.container])
    }
}

export const stateHandlers: Map<SelectionState, SelectionStateHandler> = new Map();

stateHandlers.set(SelectionState.full, new FullSelectionStateHandler());
stateHandlers.set(SelectionState.partial, new PartialSelectionStateHandler());
stateHandlers.set(SelectionState.over, new OverSelectionStateHandler());
stateHandlers.set(SelectionState.none, new NoneSelectionStateHandler());

export abstract class AbstractBlockCommand extends AbstractCommand<string> {

    abstract get callback(): (value: string, containers: AbstractTreeNode[]) => void;

    execute(value: string, context: Context): void {
        const {ast: {triggerAST}, selection: {triggerSelection}} = context;
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

export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    abstract get format(): string;

    execute(value: E, context: Context): void {

        const {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}, selection: {currentSelection, triggerSelection}} = context

        if (currentSelection) {

            if (currentSelection.startContainer === currentSelection.endContainer) {
                let container = currentSelection.startContainer;

                if (container instanceof TextTreeNode) {
                    let textNode = partial(currentSelection);
                    textNode[this.format] = value
                }
            } else {
                let nodes = over(currentSelection, root);

                for (const node of nodes) {
                    if (node instanceof TextTreeNode) {
                        node[this.format] = value;
                    }
                }

            }

            triggerSelection()

        } else {
            if (currentCursor && currentCursor.container instanceof TextTreeNode) {
                currentCursor.container[this.format] = value

                triggerCursor({
                    currentCursor : currentCursor
                })
            }
        }

        triggerAST()

    }
}