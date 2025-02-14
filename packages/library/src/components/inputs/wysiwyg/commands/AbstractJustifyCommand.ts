import {AbstractCommand} from "./AbstractCommand";

export abstract class AbstractJustifyCommand extends AbstractCommand<boolean> {

    abstract get textAlign() : string

    execute(value: boolean): void {
        let range = this.range

        if (range.collapsed) {

            let ancestorContainer = range.commonAncestorContainer;
            let parent = ancestorContainer.parentElement
            let grandParent = parent.parentElement

            if (parent instanceof HTMLSpanElement) {

                if (value) {
                    grandParent.style.textAlign = this.textAlign
                } else {
                    grandParent.style.textAlign = ""
                }

            } else {

                if (value) {
                    parent.style.textAlign = this.textAlign
                } else {
                    parent.style.textAlign = ""
                }


            }

        }
    }


}