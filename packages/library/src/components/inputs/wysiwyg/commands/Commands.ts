function mergeSpans(container : Element) {
    let spans = Array.from(container.querySelectorAll("span"));

    for (let i = spans.length - 1; i > 0; i--) {
        let current = spans[i];
        let previous = spans[i - 1];

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
function normalizeText(element : Element) {
    element.normalize()

    for (const child of element.children) {
        normalizeText(child)
    }
}

function normalizeSpan(element : Element) {
    mergeSpans(element)

    for (const child of element.children) {
        normalizeSpan(child)
    }
}

export function normalize(element : HTMLElement) {
    normalizeSpan(element)
    normalizeText(element)
}

export function modify(childNodes: ChildNode[], callback : (element : HTMLElement) => void) {
    let documentFragment = document.createDocumentFragment();
    for (const node of childNodes) {
        if (node instanceof HTMLSpanElement) {
            callback(node)
            documentFragment.appendChild(node)
        } else {
            if (node instanceof HTMLDivElement) {
                let fragment = modify(Array.from(node.childNodes), callback);
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
