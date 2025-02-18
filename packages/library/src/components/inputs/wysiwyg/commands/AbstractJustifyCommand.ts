import {AbstractCommand} from "./AbstractCommand";
import {findNextTextNode, over, partial, RangeState, rangeState, selectNodeContents, selectStartAndEnd} from "./Commands";

export abstract class AbstractJustifyCommand extends AbstractCommand<boolean> {

    abstract get textAlign() : string

    execute(value: boolean): void {
        let range = this.range
        let state = rangeState(range);

        switch (state) {
            case RangeState.collapsed : {
                let container = range.startContainer
                let startOffset = range.startOffset

                let parentElement = range.startContainer.parentElement;
                let grandParent = parentElement.parentElement
                grandParent.style.textAlign = this.textAlign

                selectStartAndEnd(findNextTextNode(container), findNextTextNode(container), startOffset, startOffset)
            }
                break
            case RangeState.over : {
                const {spans: [[preLeft, preMiddle, preRight], [postLeft, postMiddle, postRight]]} = over(range)

                let preParent = preMiddle.parentElement
                let postParent = postMiddle.parentElement

                let preRightElement = document.createElement(preParent.localName);
                preRightElement.appendChild(preRight)
                preParent.after(preRightElement)

                let preMiddleElement = document.createElement(preParent.localName);
                preMiddleElement.appendChild(preMiddle)
                preParent.after(preMiddleElement)


                let postRightElement = document.createElement(postParent.localName);
                postRightElement.appendChild(postLeft)
                postParent.before(postRightElement)

                let postMiddleElement = document.createElement(postParent.localName);
                postMiddleElement.appendChild(postMiddle)
                postParent.before(postMiddleElement)

                let newRange = selectStartAndEnd(findNextTextNode(preMiddle), findNextTextNode(postMiddle), 0, 0);
                let container = newRange.commonAncestorContainer as HTMLElement
                let elements = container.querySelectorAll("h1, h2, h3, h4, h5, h6, p");

                for (const element of elements) {
                    if (newRange.intersectsNode(element)) {
                        let htmlElement = element as HTMLElement
                        htmlElement.style.textAlign = this.textAlign
                    }
                }

                selectStartAndEnd(findNextTextNode(preMiddle), findNextTextNode(postRight), 0, 0);
            }
                break
            case RangeState.full : {
                let parentElement = range.startContainer.parentElement;
                let grandParent = parentElement.parentElement

                grandParent.style.textAlign = this.textAlign

                selectNodeContents(parentElement)
            }
                break
            case RangeState.partial : {
                let [left, middle, right] = partial(range);

                let paragraph = middle.parentElement;

                let rightElement = document.createElement(paragraph.localName);
                rightElement.style.textAlign = this.textAlign
                rightElement.appendChild(right)
                paragraph.after(rightElement)

                let middleElement = document.createElement(paragraph.localName);
                middleElement.style.textAlign = this.textAlign
                middleElement.appendChild(middle)
                paragraph.after(middleElement)


            }
                break
        }


    }


}