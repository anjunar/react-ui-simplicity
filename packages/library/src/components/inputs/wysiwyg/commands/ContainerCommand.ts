import {AbstractCommand} from "./AbstractCommand";
import {over, partial, RangeState, rangeState, selectNodeContents, selectStartAndEnd} from "./Commands";
import {AbstractFormatCommand} from "./AbstractFormatCommand";

function insertAfter(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}

export class ContainerCommand extends AbstractCommand<string> {
    execute(value: string): void {
        let range = this.range
        let state = rangeState(range);

        switch (state) {
            case RangeState.collapsed : {
                let container = range.startContainer
                let startOffset = range.startOffset

                let parentElement = range.startContainer.parentElement;
                let grandParent = parentElement.parentElement
                let htmlElement = document.createElement(value);
                htmlElement.appendChild(parentElement)
                grandParent.replaceWith(htmlElement)

                selectStartAndEnd(container, container, startOffset, startOffset)
            } break
            case RangeState.over : {
                const [[preLeft, preMiddle, preRight], [postLeft, postMiddle, postRight]] = over({
                    range : range,
                    value : value
                })

                let preParent = preMiddle.parentElement
                let postParent = postMiddle.parentElement

                let preRightElement = document.createElement(preParent.localName);
                preRightElement.appendChild(preRight)
                preParent.after(preRightElement)

                let preMiddleElement = document.createElement(value);
                preMiddleElement.appendChild(preMiddle)
                preParent.after(preMiddleElement)


                let postRightElement = document.createElement(value);
                postRightElement.appendChild(postLeft)
                postParent.before(postRightElement)

                let postMiddleElement = document.createElement(value);
                postMiddleElement.appendChild(postMiddle)
                postParent.before(postMiddleElement)




                let newRange = selectStartAndEnd(preMiddle, postMiddle, 0, 0);

                let container = newRange.commonAncestorContainer as HTMLElement



                let elements = container.querySelectorAll("h1, h2, h3, h4, h5, h6, p");

                for (const element of elements) {
                    if (newRange.intersectsNode(element)) {
                        let htmlElement = document.createElement(value);
                        for (const child of Array.from(element.children)) {
                            htmlElement.appendChild(child)
                        }
                        element.replaceWith(htmlElement)
                    }
                }

                selectStartAndEnd(preMiddle.firstChild, postRight.firstChild, 0, 0);


            } break
            case RangeState.full : {
                let parentElement = range.startContainer.parentElement;
                let grandParent = parentElement.parentElement
                let htmlElement = document.createElement(value);
                htmlElement.appendChild(parentElement)
                grandParent.replaceWith(htmlElement)

                selectNodeContents(parentElement)
            } break
            case RangeState.partial : {
                let [left, middle, right] = partial({
                    range : range,
                    value : value
                });

                let paragraph = middle.parentElement;

                let rightElement = document.createElement(paragraph.localName);
                rightElement.appendChild(right)
                paragraph.after(rightElement)

                let middleElement = document.createElement(value);
                middleElement.appendChild(middle)
                paragraph.after(middleElement)


            } break
        }



    }

}