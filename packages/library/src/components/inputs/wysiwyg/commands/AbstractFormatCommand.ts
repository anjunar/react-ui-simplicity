import {AbstractCommand} from "./AbstractCommand";
import {AbstractNode, RootNode, TextNode} from "../ast/TreeNode";
import {Context} from "../components/EditorContext";

function splitIntoText(container: TextNode, startOffset : number = 0, endOffset : number = container.text.length) {
    let {bold, italic, deleted, sup, sub} = container
    let start = container.text.substring(startOffset, endOffset);
    let textNode = new TextNode(start);
    textNode.bold = bold;
    textNode.italic = italic;
    textNode.deleted = deleted;
    textNode.sup = sup;
    textNode.sub = sub;

    if (textNode.text) {
        return textNode
    }

    return null
}

function partial(currentSelection: { startContainer: AbstractNode; startOffset: number; endContainer: AbstractNode; endOffset: number }) {
    let container = currentSelection.startContainer as TextNode;

    let startText = splitIntoText(container, 0, currentSelection.startOffset);
    let middleText = splitIntoText(container, currentSelection.startOffset, currentSelection.endOffset);
    let endText = splitIntoText(container, currentSelection.endOffset);

    let parentIndex = currentSelection.startContainer.parentIndex;

    if (endText) {
        container.parent.insertChild(parentIndex, endText)
    }

    if (middleText) {
        container.parent.insertChild(parentIndex, middleText)
    }

    if (startText) {
        container.parent.insertChild(parentIndex, startText)
    }


    container.remove()

    currentSelection.startContainer = middleText
    currentSelection.startOffset = 0
    currentSelection.endContainer = middleText
    currentSelection.endOffset = middleText.text.length

    return middleText
}

function over(currentSelection: { startContainer: AbstractNode; startOffset: number; endContainer: AbstractNode; endOffset: number }, root: RootNode) {
    let startContainer = currentSelection.startContainer;
    let endContainer = currentSelection.endContainer;

    let preBegin = splitIntoText(startContainer as TextNode, 0, currentSelection.startOffset)
    let postBegin = splitIntoText(startContainer as TextNode, currentSelection.startOffset)
    let preEnd = splitIntoText(endContainer as TextNode, 0, currentSelection.endOffset)
    let postEnd = splitIntoText(endContainer as TextNode, currentSelection.endOffset)

    let startIndex = startContainer.parentIndex;
    if (postBegin) {
        startContainer.parent.insertChild(startIndex, postBegin)
    }
    if (preBegin) {
        startContainer.parent.insertChild(startIndex, preBegin)
    }
    let endIndex = endContainer.parentIndex;
    if (postEnd) {
        endContainer.parent.insertChild(endIndex, postEnd)
    }
    if (preEnd) {
        endContainer.parent.insertChild(endIndex, preEnd)
    }

    startContainer.remove()
    endContainer.remove()

    currentSelection.startContainer = postBegin
    currentSelection.startOffset = 0
    currentSelection.endContainer = preEnd
    currentSelection.endOffset = preEnd.text.length

    let flattened = root.flatten
    return flattened.slice(flattened.indexOf(postBegin), flattened.indexOf(postEnd || preEnd))
}

export abstract class AbstractFormatCommand extends AbstractCommand<boolean> {

    abstract get format(): string;

    execute(value: boolean, context : Context): void {

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