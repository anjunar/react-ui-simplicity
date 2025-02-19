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

    for (const child of element.children) {
        normalizeSpan(child)
    }
}

export function removeJunk(element : HTMLElement) {

    if (element.childNodes.length === 0 && ! (element instanceof HTMLBRElement) && ! element.hasAttribute("contentEditable")) {
        element.remove()
    }

    let style = element.getAttribute("style");
    if (! style) {
        element.removeAttribute("style")
    } else {

        if (element.style.color === "var(--color-text)") {
            element.style.color = ""
        }

        if (element.style.backgroundColor === "var(--color-background-primary)") {
            element.style.backgroundColor = ""
        }

        if (element.style.textAlign === "start") {
            element.style.textAlign = ""
        }
    }

    if (! element.getAttribute("class")) {
        element.removeAttribute("class")
    }

    for (const child of element.children) {
        removeJunk(child as HTMLElement)
    }

}

export function normalize(element : HTMLElement) {
    removeJunk(element)
    normalizeSpan(element)
    element.normalize()
    removeJunk(element)
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

export function collapsed<E>(range : Range) {

    let spanElement = range.startContainer.parentElement;

    selectStartAndEnd(findNextTextNode(range.startContainer), findNextTextNode(range.endContainer), range.startOffset, range.endOffset)

    return spanElement
}

export function over(range : Range) {

    let container = range.commonAncestorContainer as HTMLElement
    let preParent = range.startContainer.parentElement
    let postParent = range.endContainer.parentElement


    let [preLeft, preMiddle, preRight] = splitTextNodeIntoSpans(range.startContainer, range.startOffset, range.startContainer.textContent.length);
    let [postLeft, postMiddle, postRight] = splitTextNodeIntoSpans(range.endContainer, 0, range.endOffset)

    return {
        container : container,
        spans : [
            [preLeft, preMiddle, preRight, preParent],
            [postLeft, postMiddle, postRight, postParent]
        ]
    }

}

export function full(range : Range) {

    let spanElement = range.startContainer.parentElement;

    selectNodeContents(spanElement);

    return spanElement
}

export function partial(range : Range) {

    let parentElement = range.startContainer.parentElement;
    let [left, middle, right] = splitTextNodeIntoSpans(range.startContainer, range.startOffset, range.endOffset);

    selectNodeContents(middle);

    return [left, middle, right, parentElement]
}

export function findNextTextNode(node : Node) {

    if (node.nodeType === Node.TEXT_NODE) {
        return node
    }

    let start = document.createTreeWalker(
       node,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => node.textContent.trim().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
    );

    let cursor : Node;
    while (cursor = start.nextNode()) {
        if (cursor.nodeType === Node.TEXT_NODE) {
            return cursor
        }
    }

    return node

}
