
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
                previous.appendChild(current.firstChild);
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

export function modify(childNodes: ChildNode[], callback : (element : HTMLElement) => void, newElement : string = "p") {
    let documentFragment = document.createDocumentFragment();
    for (const node of childNodes) {
        if (node instanceof HTMLSpanElement) {
            callback(node)
            documentFragment.appendChild(node)
        } else {
            if (node instanceof HTMLParagraphElement) {
                let fragment = modify(Array.from(node.childNodes), callback);
                let divElement = document.createElement(newElement);
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

export function buildNewRange(oldRange: { startOffset: number; endOffset: number; startContainer: Node; endContainer: Node }) {
    let newRange = document.createRange();
    newRange.setStart(oldRange.startContainer, oldRange.startOffset)
    newRange.setEnd(oldRange.endContainer, oldRange.endOffset)
    let selection = window.getSelection();
    selection.removeAllRanges()
    selection.addRange(newRange)
}
