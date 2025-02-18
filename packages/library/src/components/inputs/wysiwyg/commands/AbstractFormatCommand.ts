import {AbstractCommand} from "./AbstractCommand";
import {RangeState, rangeState} from "./Commands";

function splitTextNodeIntoSpans(textNode : Node, startOffset : number, endOffset : number) {
    if (textNode.nodeType !== Node.TEXT_NODE) return null;

    const parentSpan = textNode.parentElement;
    if (!parentSpan || parentSpan.tagName !== "SPAN") return null;

    const parent = parentSpan.parentNode;
    const beforeText = textNode.textContent.slice(0, startOffset);
    const selectedText = textNode.textContent.slice(startOffset, endOffset);
    const afterText = textNode.textContent.slice(endOffset);

    const newSpans : HTMLSpanElement[] = [];

    const beforeSpan = document.createElement("span");
    beforeSpan.textContent = beforeText;
    newSpans.push(beforeSpan);
    parent.insertBefore(beforeSpan, parentSpan);

    const selectedSpan = document.createElement("span");
    selectedSpan.textContent = selectedText;
    newSpans.push(selectedSpan);
    parent.insertBefore(selectedSpan, parentSpan);

    const afterSpan = document.createElement("span");
    afterSpan.textContent = afterText;
    newSpans.push(afterSpan);
    parent.insertBefore(afterSpan, parentSpan);

    parent.removeChild(parentSpan);

    return newSpans;
}

export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    execute(value: E): void {

        let range = this.range;
        let state = rangeState(range);

        function selectNodeContents(spanElement: HTMLElement) {
            let newRange = document.createRange();
            newRange.selectNodeContents(spanElement.firstChild)
            let selection = window.getSelection();
            selection.removeAllRanges()
            selection.addRange(newRange)
        }

        function selectStartAndEnd(start: Node, end: Node, startOffset : number, endOffset : number) {
            let newRange = document.createRange();
            newRange.setStart(start, startOffset)
            newRange.setEnd(end, endOffset)

            let selection = window.getSelection();
            selection.removeAllRanges()
            selection.addRange(newRange)
            return newRange;
        }

        switch (state) {
            case RangeState.collapsed : {
                let spanElement = range.startContainer.parentElement;
                this.addOrRemove(value, spanElement);

                selectStartAndEnd(range.startContainer, range.endContainer, range.startOffset, range.endOffset)
            } break
            case RangeState.over : {
                let container = range.commonAncestorContainer as HTMLElement
                let preParent = range.startContainer.parentElement
                let postParent = range.endContainer.parentElement


                let [preLeft, preMiddle, preRight] = splitTextNodeIntoSpans(range.startContainer, range.startOffset, range.startContainer.textContent.length);
                let [postLeft, postMiddle, postRight] = splitTextNodeIntoSpans(range.endContainer, 0, range.endOffset)

                this.inherit(preLeft, preParent)
                this.inherit(preMiddle, preParent)
                this.inherit(preRight, preParent)

                this.inherit(postLeft, postParent)
                this.inherit(postMiddle, postParent)
                this.inherit(postRight, postParent)

                let spans = container.getElementsByTagName("span");

                let newRange = selectStartAndEnd(preMiddle, postMiddle, 0 , 1);

                for (const span of spans) {
                    if (newRange.intersectsNode(span)) {
                        this.addOrRemove(value, span)
                    }
                }

            } break
            case RangeState.full : {
                let spanElement = range.startContainer.parentElement;
                this.addOrRemove(value, spanElement)

                selectNodeContents(spanElement);
            } break
            case RangeState.partial : {
                let parentElement = range.startContainer.parentElement;
                let [left, middle, right] = splitTextNodeIntoSpans(range.startContainer, range.startOffset, range.endOffset);

                this.inherit(left, parentElement)
                this.inherit(middle, parentElement)
                this.inherit(right, parentElement)

                this.addOrRemove(value, middle)

                selectNodeContents(middle);
            } break
        }


    }

    private addOrRemove(value: E, spanElement: HTMLElement) {
        value ? this.addCallback(value)(spanElement) : this.removeCallback(value)(spanElement)
    }

    inherit(node: HTMLElement, parent: HTMLElement): void {
        if (!parent.hasAttribute("contentEditable")) {
            let styleAttribute = parent.getAttribute("style");
            if (styleAttribute) {
                node.setAttribute("style", styleAttribute)
            } else {
                node.removeAttribute("style")
            }

            node.className = parent.className

            if (!node.className) {
                node.removeAttribute("class")
            }
        }
    }

    abstract addCallback(value: E): (element: HTMLElement) => void

    abstract removeCallback(value: E): (element: HTMLElement) => void


}