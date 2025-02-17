import {AbstractCommand} from "./AbstractCommand";
import {buildNewRange, modify} from "./Commands";

interface Context {
    range : Range
    oldRange? : any
    node : Node

    callback :(element : HTMLElement) => void,
    inherit:(node: HTMLElement, parent: HTMLElement) => void,
}

function cutMiddleOut(context : Context){

    const {node, range, callback, inherit} = context

    let parentElement = node.parentElement
    let completeText = node.textContent

    let left = document.createTextNode(completeText.substring(0, range.startOffset))
    let middle = document.createTextNode(completeText.substring(range.startOffset, range.endOffset))
    let right = document.createTextNode(completeText.substring(range.endOffset))

    let leftSpan = document.createElement("span")
    inherit(leftSpan, parentElement)
    leftSpan.appendChild(left)

    let middleSpan = document.createElement("span")
    inherit(middleSpan, parentElement)
    callback(middleSpan)
    middleSpan.appendChild(middle)

    let rightSpan = document.createElement("span")
    inherit(rightSpan, parentElement)
    rightSpan.appendChild(right)

    if (parentElement instanceof HTMLSpanElement) {
        let grandParent = parentElement.parentElement;
        grandParent.insertBefore(leftSpan, parentElement)
        grandParent.insertBefore(middleSpan, parentElement)
        grandParent.insertBefore(rightSpan, parentElement)
        parentElement.remove()
        node.textContent = ""
    } else {
        parentElement.appendChild(leftSpan)
        parentElement.appendChild(middleSpan)
        parentElement.appendChild(rightSpan)
        node.textContent = ""
    }
    return {startContainer : middle, startOffset : 0, endContainer : middle, endOffset : middle.length}
}

function rangeOverBlocks(context : Context) {
    const {range, callback} = context

    let contents = range.extractContents();
    let childNodes = Array.from(contents.childNodes);
    let documentFragment = modify(childNodes, callback);
    let firstChild = documentFragment.firstChild
    let lastChild = documentFragment.lastChild
    range.insertNode(documentFragment)
    return {startContainer: firstChild, startOffset: 0, endContainer: lastChild, endOffset: 1}
}

function modifyFullRangeSpan(context : Context) {
    const {node, callback} = context
    callback(node.parentElement)
    return context.oldRange
}


function firstElement(context : Context) {
    const {node, range, callback, oldRange} = context

    let parentElement = node.parentElement

    let element = document.createElement("span");
    element.appendChild(range.startContainer)
    parentElement.appendChild(element)
    callback(element)
    return {startContainer: element.firstChild, startOffset: oldRange.startOffset, endContainer: element.firstChild, endOffset: oldRange.endOffset}
}

export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    execute(value: E): void {

        let range = this.range;
        let oldRange = this.oldRange

        let context = {
            node : range.startContainer,
            oldRange : oldRange,
            range : range,
            callback : value ? this.addCallback(value) : this.removeCallback(value),
            inherit : this.inherit
        };

        if (range.collapsed) {
            if (value) {
                let parentElement = range.startContainer.parentElement;
                if (parentElement instanceof HTMLSpanElement) {
                    modifyFullRangeSpan(context);
                    buildNewRange(oldRange)
                } else {
                    let newRange = firstElement(context);
                    buildNewRange(newRange)
                }
            } else {
                let newRange = modifyFullRangeSpan(context);
                buildNewRange(newRange)
            }
        } else {
            let ancestorContainer = range.commonAncestorContainer;
            if (ancestorContainer === range.startContainer && ancestorContainer === range.endContainer) {
                let completeText = ancestorContainer.textContent

                if (range.startOffset === 0 && range.endOffset === completeText.length) {
                    if (ancestorContainer.parentElement instanceof HTMLSpanElement) {
                        let newRange = modifyFullRangeSpan(context);
                        buildNewRange(newRange)
                    } else {
                        let newRange = rangeOverBlocks(context);
                        buildNewRange(newRange)
                    }
                }  else {
                    let newRange = cutMiddleOut(context);
                    buildNewRange(newRange)
                }

            } else {
                let newRange = rangeOverBlocks(context);
                buildNewRange(newRange)
            }
        }

    }

    inherit(node: HTMLElement, parent: HTMLElement): void {
        if (! parent.hasAttribute("contentEditable")) {
            let styleAttribute = parent.getAttribute("style");
            if (styleAttribute) {
                node.setAttribute("style", styleAttribute)
            } else {
                node.removeAttribute("style")
            }

            node.className = parent.className

            if (! node.className) {
                node.removeAttribute("class")
            }
        }
    }

    abstract addCallback(value : E) : (element : HTMLElement) => void

    abstract removeCallback(value : E) : (element : HTMLElement) => void


}