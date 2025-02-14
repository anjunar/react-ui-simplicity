export abstract class AbstractCommand<E> {

    get range() {
        let selection = window.getSelection();
        if (selection?.rangeCount) {
            return selection.getRangeAt(0)
        }
        return null
    }

    modify(childNodes: ChildNode[], callback : (element : HTMLElement) => void) {
        let documentFragment = document.createDocumentFragment();
        for (const node of childNodes) {
            if (node instanceof HTMLSpanElement) {
                callback(node)
                documentFragment.appendChild(node)
            } else {
                if (node instanceof HTMLDivElement) {
                    let fragment = this.modify(Array.from(node.childNodes), callback);
                    let divElement = document.createElement("div");
                    divElement.appendChild(fragment)
                    documentFragment.appendChild(divElement)
                } else {
                    let element = document.createElement("span");
                    callback(element)
                    element.appendChild(node)
                    documentFragment.appendChild(element)
                }
            }
        }
        return documentFragment;
    }


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
                        let documentFragment = this.modify(childNodes, this.addCallback(value));
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
                let documentFragment = this.modify(childNodes, this.addCallback(value));
                range.insertNode(documentFragment)
            }
        } else {
            if (range.collapsed) {
                this.removeCallback(value)(range.startContainer.parentElement)
            } else {
                let contents = range.extractContents();
                let childNodes = Array.from(contents.childNodes);
                let documentFragment = this.modify(childNodes, this.removeCallback(value));
                range.insertNode(documentFragment)
            }
        }
    }

    inherit(node: HTMLElement, parent: HTMLElement): void {
        if (! parent.hasAttribute("contentEditable")) {
            node.setAttribute("style", parent.getAttribute("style"))
            node.className = parent.className
        }
    }

    abstract addCallback(value : E) : (element : HTMLElement) => void

    abstract removeCallback(value : E) : (element : HTMLElement) => void

}