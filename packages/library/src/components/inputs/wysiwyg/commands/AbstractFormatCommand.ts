import {AbstractCommand} from "./AbstractCommand";
import {buildNewRange, modify} from "./Commands";

const cutMiddleOut = (
    completeText: string,
    parentElement: HTMLElement | HTMLSpanElement,
    ancestorContainer: Node,
    callback :(element : HTMLElement) => void,
    inherit:(node: HTMLElement, parent: HTMLElement) => void,
    range : Range)=> {

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
        ancestorContainer.textContent = ""
    } else {
        parentElement.appendChild(leftSpan)
        parentElement.appendChild(middleSpan)
        parentElement.appendChild(rightSpan)
        ancestorContainer.textContent = ""
    }
    return {startContainer : middle, startOffset : 0, endContainer : middle, endOffset : middle.length}
}

function rangeOverBlocks(range: Range, callback: (element: HTMLElement) => void) {
    let contents = range.extractContents();
    let childNodes = Array.from(contents.childNodes);
    let documentFragment = modify(childNodes, callback);
    let firstChild = documentFragment.firstChild
    let lastChild = documentFragment.lastChild
    range.insertNode(documentFragment)
    return {startContainer: firstChild, startOffset: 0, endContainer: lastChild, endOffset: 1}
}

const modifyFullRangeSpan = <E>(
    value : E,
    parentElement: HTMLElement,
    addCallback: (value : E)  => (element : HTMLElement) => void,
    removeCallback: (value : E)  => (element : HTMLElement) => void
)=> {
    value ? addCallback(value)(parentElement) : removeCallback(value)(parentElement)
}


export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    execute(value: E): void {

        let range = this.range;
        let oldRange = this.oldRange

        const firstSpan = (parentElement: HTMLElement) => {
            let element = document.createElement("span");
            element.appendChild(range.startContainer)
            parentElement.appendChild(element)
            this.addCallback(value)(element)
            return {startContainer : element.firstChild, startOffset : oldRange.startOffset, endContainer : element.firstChild, endOffset : oldRange.endOffset}
        }

        if (range.collapsed) {
            if (value) {
                let parentElement = range.startContainer.parentElement;
                if (parentElement instanceof HTMLSpanElement) {
                    modifyFullRangeSpan(value, parentElement, this.addCallback, this.removeCallback);
                    buildNewRange(oldRange)
                } else {
                    let newRange = firstSpan(parentElement);
                    buildNewRange(newRange)
                }
            } else {
                modifyFullRangeSpan(value, range.startContainer.parentElement, this.addCallback, this.removeCallback);
                buildNewRange(oldRange)
            }
        } else {
            let selection = window.getSelection();
            selection.removeAllRanges()

            let ancestorContainer = range.commonAncestorContainer;
            if (ancestorContainer === range.startContainer && ancestorContainer === range.endContainer) {
                let completeText = ancestorContainer.textContent
                let parentElement = ancestorContainer.parentElement;

                if (range.startOffset === 0 && range.endOffset === completeText.length) {
                    if (ancestorContainer.parentElement instanceof HTMLSpanElement) {
                        modifyFullRangeSpan(value, parentElement, this.addCallback, this.removeCallback);
                        buildNewRange(oldRange)
                    } else {
                        let newRange = rangeOverBlocks(range, value ? this.addCallback(value) : this.removeCallback(value));
                        buildNewRange(newRange)
                    }
                }  else {
                    let newRange = cutMiddleOut(
                        completeText,
                        parentElement,
                        ancestorContainer,
                        value ? this.addCallback(value) : this.removeCallback(value),
                        this.inherit,
                        range
                    );
                    buildNewRange(newRange)
                }

            } else {
                let newRange = rangeOverBlocks(range, value ? this.addCallback(value) : this.removeCallback(value),);
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