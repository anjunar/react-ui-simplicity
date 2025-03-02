import React, {useContext} from "react"
import EditorContext from "./EditorContext";
import {AbstractTreeNode, RootTreeNode, TextTreeNode} from "../ast/TreeNode";

function splitIntoText(container: TextTreeNode, startOffset : number = 0, endOffset : number = container.text.length) {
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

function partial(currentSelection: { startContainer: AbstractTreeNode; startOffset: number; endContainer: AbstractTreeNode; endOffset: number }) {
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

function over(currentSelection: { startContainer: AbstractTreeNode; startOffset: number; endContainer: AbstractTreeNode; endOffset: number }, root: RootTreeNode) {
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

function Toolbar(properties: Toolbar.Attributes) {

    const {} = properties

    const {ast : {root, triggerAST}, cursor : {currentCursor}, selection : {currentSelection, triggerSelection}} = useContext(EditorContext)

    function onBoldClick() {
        if (currentSelection) {

            if (currentSelection.startContainer === currentSelection.endContainer) {
                let container = currentSelection.startContainer;

                if (container instanceof TextTreeNode) {
                    let textNode = partial(currentSelection);
                    textNode.bold = true;
                }
            } else {
                let nodes = over(currentSelection, root);

                for (const node of nodes) {
                    if (node instanceof TextTreeNode) {
                        node.bold = true;
                    }
                }

            }

            triggerSelection()

        } else {
            if (currentCursor && currentCursor.container instanceof TextTreeNode) {
                currentCursor.container.bold = ! currentCursor.container.bold
            }
        }
        
        triggerAST()

    }

    return (
        <div>
            <button className={"material-icons"} onClick={onBoldClick}>format_bold</button>
        </div>
    )
}

namespace Toolbar {
    export interface Attributes {

    }
}

export default Toolbar
