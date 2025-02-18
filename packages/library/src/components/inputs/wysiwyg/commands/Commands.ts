

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
