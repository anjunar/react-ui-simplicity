import {AbstractCommand} from "./AbstractCommand";
import {collapsed, findNextTextNode, full, over, partial, RangeState, rangeState, selectStartAndEnd} from "./Commands";

export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    execute(value: E): void {

        let range = this.range;
        let state = rangeState(range);

        switch (state) {
            case RangeState.collapsed : {
                let result = collapsed(range);
                this.addOrRemove(value, result);
            } break
            case RangeState.over : {
                let {
                    container : container,
                    spans : [
                        [preLeft, preMiddle, preRight, preParent],
                        [postLeft, postMiddle, postRight, postParent]
                    ]
                } = over(range);

                let newRange = selectStartAndEnd(findNextTextNode(preMiddle), findNextTextNode(postMiddle), 0,  0);

                this.inherit(preLeft, preParent)
                this.inherit(preMiddle, preParent)
                this.inherit(preRight, preParent)

                this.inherit(postLeft, postParent)
                this.inherit(postMiddle, postParent)
                this.inherit(postRight, postParent)

                let spans = container.getElementsByTagName("span");

                for (const span of spans) {
                    if (newRange.intersectsNode(span)) {
                        this.addOrRemove(value, span)
                    }
                }

            } break
            case RangeState.full : {
                let result = full(range);
                this.addOrRemove(value, result)
            } break
            case RangeState.partial : {
                let [left, middle, right, parentElement] = partial(range);

                this.inherit(left, parentElement)
                this.inherit(middle, parentElement)
                this.inherit(right, parentElement)
                this.addOrRemove(value, middle)
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