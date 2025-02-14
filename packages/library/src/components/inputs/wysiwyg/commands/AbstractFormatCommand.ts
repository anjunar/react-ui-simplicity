import {AbstractCommand} from "./AbstractCommand";
import {modify} from "./Commands";

export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    execute(value: E): void {

        let range = this.range;

        if (value) {
            let ancestorContainer = range.commonAncestorContainer;

            if (ancestorContainer === range.startContainer && ancestorContainer === range.endContainer) {
                let completeText = ancestorContainer.textContent
                let parentElement = ancestorContainer.parentElement;

                if (range.startOffset === 0 && range.endOffset === completeText.length) {
                    if (ancestorContainer.parentElement instanceof HTMLSpanElement) {
                        this.addCallback(value)(parentElement)
                    } else {
                        let contents = range.extractContents();
                        let childNodes = Array.from(contents.childNodes);
                        let documentFragment = modify(childNodes, this.addCallback(value));
                        range.insertNode(documentFragment)
                    }
                }  else {
                    let left = completeText.substring(0, range.startOffset)
                    let middle = completeText.substring(range.startOffset, range.endOffset)
                    let right = completeText.substring(range.endOffset)

                    let leftSpan = document.createElement("span")
                    this.inherit(leftSpan, parentElement)
                    leftSpan.textContent = left

                    let middleSpan = document.createElement("span")
                    this.inherit(middleSpan, parentElement)
                    this.addCallback(value)(middleSpan)
                    middleSpan.textContent = middle

                    let rightSpan = document.createElement("span")
                    this.inherit(rightSpan, parentElement)
                    rightSpan.textContent = right

                    if (parentElement instanceof HTMLSpanElement) {
                        let grandParent = parentElement.parentElement;
                        grandParent.insertBefore(leftSpan, parentElement)
                        grandParent.insertBefore(middleSpan, parentElement)
                        grandParent.insertBefore(rightSpan, parentElement)
                        parentElement.remove()
                    } else {
                        parentElement.appendChild(leftSpan)
                        parentElement.appendChild(middleSpan)
                        parentElement.appendChild(rightSpan)
                    }

                    let newRange = document.createRange();
                    newRange.setStart(middleSpan.firstChild, 0)
                    newRange.setEnd(middleSpan.firstChild, middle.length)

                    let selection = window.getSelection();
                    selection.removeAllRanges()
                    selection.addRange(newRange)

                    ancestorContainer.textContent = ""
                }

            } else {
                let contents = range.extractContents();
                let childNodes = Array.from(contents.childNodes);
                let documentFragment = modify(childNodes, this.addCallback(value));
                range.insertNode(documentFragment)
            }
        } else {
            if (range.collapsed) {
                this.removeCallback(value)(range.startContainer.parentElement)
            } else {
                let contents = range.extractContents();
                let childNodes = Array.from(contents.childNodes);
                let documentFragment = modify(childNodes, this.removeCallback(value));
                range.insertNode(documentFragment)
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