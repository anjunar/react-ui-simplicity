import {AbstractTreeNode, RootTreeNode, TextTreeNode} from "../core/TreeNode";

export function splitIntoText(container: TextTreeNode, startOffset: number = 0, endOffset: number = container.text.length) {
    let {bold, italic, deleted, sup, sub} = container
    let start = container.text.substring(startOffset, endOffset);
    let textNode = new TextTreeNode(start);
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

export function splitIntoContainers(textNode: TextTreeNode) {
    let parent = textNode.parent;
    let grandParent = parent.parent;
    let index = textNode.parentIndex;

    let start = parent.newInstance()
    let end = parent.newInstance()

    let startNodes = parent.children.slice(0, index);
    let endNodes = parent.children.slice(index + 1);

    for (const startNode of startNodes) {
        start.appendChild(startNode)
    }
    for (const endNode of endNodes) {
        end.appendChild(endNode)
    }

    if (start.children.length > 0) {
        grandParent.insertChild(parent.parentIndex, start)
    }
    if (end.children.length > 0) {
        grandParent.insertChild(parent.parentIndex + 1, end)
    }

    return textNode
}

export function partial(currentSelection: { startContainer: AbstractTreeNode; startOffset: number; endContainer: AbstractTreeNode; endOffset: number }) {
    let container = currentSelection.startContainer as TextTreeNode;

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

export function over(currentSelection: { startContainer: AbstractTreeNode; startOffset: number; endContainer: AbstractTreeNode; endOffset: number }, root: RootTreeNode) {
    let startContainer = currentSelection.startContainer;
    let endContainer = currentSelection.endContainer;

    let preBegin = splitIntoText(startContainer as TextTreeNode, 0, currentSelection.startOffset)
    let postBegin = splitIntoText(startContainer as TextTreeNode, currentSelection.startOffset)
    let preEnd = splitIntoText(endContainer as TextTreeNode, 0, currentSelection.endOffset)
    let postEnd = splitIntoText(endContainer as TextTreeNode, currentSelection.endOffset)

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
