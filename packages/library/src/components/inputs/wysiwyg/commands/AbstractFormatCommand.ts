import {AbstractCommand} from "./AbstractCommand";
import {collapsed, Context, full, over, partial, RangeState, rangeState, selectNodeContents, selectStartAndEnd} from "./Commands";

export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    execute(value: E): void {

        let range = this.range;
        let state = rangeState(range);

        let context : Context<E> = {
            range : range,
            inherit : this.inherit,
            addOrRemove : this.addOrRemove,
            value : value
        }

        switch (state) {
            case RangeState.collapsed : {
                collapsed(context);
            } break
            case RangeState.over : {
                over(context);
            } break
            case RangeState.full : {
                full(context);
            } break
            case RangeState.partial : {
                partial(context);
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