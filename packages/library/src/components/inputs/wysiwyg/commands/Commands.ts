

function mergeSpans(container : Element) {
    let spans = Array.from(container.childNodes) as HTMLElement[];

    for (let i = spans.length - 1; i > 0; i--) {
        let current = spans[i];
        let previous = spans[i - 1];

        if (current instanceof HTMLSpanElement && previous instanceof HTMLSpanElement) {
            let currentClasses = new Set(current.classList);
            let previousClasses = new Set(previous.classList);

            if (
                currentClasses.size === previousClasses.size &&
                [...currentClasses].every(cls => previousClasses.has(cls)) &&
                current.style.cssText === previous.style.cssText
            ) {
                previous.textContent += current.textContent;
                current.remove();
            }
        }
    }
}

function normalizeSpan(element : Element) {
    mergeSpans(element)

    if (element.childNodes.length === 0 && ! (element instanceof HTMLBRElement)) {
        element.remove()
    }

    if (! element.getAttribute("style")) {
        element.removeAttribute("style")
    }

    if (! element.getAttribute("class")) {
        element.removeAttribute("class")
    }

    for (const child of element.children) {
        normalizeSpan(child)
    }
}

export function normalize(element : HTMLElement) {
    normalizeSpan(element)
    element.normalize()
}

export enum RangeState {
    collapsed = "COLLAPSED",
    full = "FULL",
    partial = "PARTIAL",
    over = "OVER"
}

export function rangeState(range : Range) {

    if (range.collapsed) {
        return RangeState.collapsed
    } else {
        if (range.startContainer === range.endContainer) {
            if (range.startOffset === 0 && range.endOffset === range.startContainer.textContent.length) {
                return RangeState.full
            } else {
                return RangeState.partial
            }
        } else {
            return RangeState.over
        }
    }
}

export function selectNodeContents(spanElement: HTMLElement) {
    let newRange = document.createRange();
    newRange.selectNodeContents(spanElement.firstChild)
    let selection = window.getSelection();
    selection.removeAllRanges()
    selection.addRange(newRange)
}

export function selectStartAndEnd(start: Node, end: Node, startOffset : number, endOffset : number) {
    let newRange = document.createRange();
    newRange.setStart(start, startOffset)
    newRange.setEnd(end, endOffset)

    let selection = window.getSelection();
    selection.removeAllRanges()
    selection.addRange(newRange)
    return newRange;
}

export interface Context<E> {
    range: Range
    inherit?: (node: HTMLElement, parent: HTMLElement) => void
    addOrRemove?: (value: E, spanElement: HTMLElement) => void
    value: E
}

function splitTextNodeIntoSpans(textNode : Node, startOffset : number, endOffset : number) {
    let parentSpan : HTMLSpanElement
    if (textNode instanceof HTMLSpanElement) {
        parentSpan = textNode
    } else {
        parentSpan = textNode.parentElement
    }


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

export function collapsed<E>(context : Context<E>) {

    const {value, addOrRemove, inherit, range} = context

    let spanElement = range.startContainer.parentElement;
    if (addOrRemove) {
        addOrRemove(value, spanElement);
    }

    selectStartAndEnd(range.startContainer, range.endContainer, range.startOffset, range.endOffset)
}

export function over<E>(context : Context<E>) {

    const {value, addOrRemove, inherit, range} = context

    let container = range.commonAncestorContainer as HTMLElement
    let preParent = range.startContainer.parentElement
    let postParent = range.endContainer.parentElement


    let [preLeft, preMiddle, preRight] = splitTextNodeIntoSpans(range.startContainer, range.startOffset, range.startContainer.textContent.length);
    let [postLeft, postMiddle, postRight] = splitTextNodeIntoSpans(range.endContainer, 0, range.endOffset)

    if (inherit) {
        inherit(preLeft, preParent)
        inherit(preMiddle, preParent)
        inherit(preRight, preParent)

        inherit(postLeft, postParent)
        inherit(postMiddle, postParent)
        inherit(postRight, postParent)
    }

    let newRange = selectStartAndEnd(preMiddle, postMiddle, 0, 0);

    if (addOrRemove) {
        let spans = container.getElementsByTagName("span");

        for (const span of spans) {
            if (newRange.intersectsNode(span)) {
                addOrRemove(value, span)
            }
        }
    }

    return [
        [preLeft, preMiddle, preRight],
        [postLeft, postMiddle, postRight]
    ]

}

export function full<E>(context : Context<E>) {
    const {value, addOrRemove, inherit, range} = context

    let spanElement = range.startContainer.parentElement;

    if (addOrRemove) {
        addOrRemove(value, spanElement)
    }

    selectNodeContents(spanElement);
}

export function partial<E>(context : Context<E>) {
    const {value, addOrRemove, inherit, range} = context

    let parentElement = range.startContainer.parentElement;
    let [left, middle, right] = splitTextNodeIntoSpans(range.startContainer, range.startOffset, range.endOffset);

    if (inherit) {
        inherit(left, parentElement)
        inherit(middle, parentElement)
        inherit(right, parentElement)
    }

    if (addOrRemove) {
        addOrRemove(value, middle)
    }

    selectNodeContents(middle);

    return [left, middle, right]
}
