import {AbstractCommand} from "./AbstractCommand";

export abstract class AbstractJustifyCommand extends AbstractCommand<boolean> {

    abstract get textAlign() : string

    execute(value: boolean): void {
        let range = this.range

        let ancestorContainer = range.commonAncestorContainer;
        let parent = ancestorContainer.parentElement
        let grandParent = parent.parentElement

        if (ancestorContainer instanceof HTMLElement) {

            let iterator = document.createNodeIterator(ancestorContainer, NodeFilter.SHOW_ELEMENT);
            let cursor = iterator.nextNode()

            while (cursor) {
                if (cursor instanceof HTMLParagraphElement && cursor instanceof HTMLHeadingElement) {
                    if (value) {
                        cursor.style.textAlign = this.textAlign === "start" ? "" : this.textAlign
                    } else {
                        cursor.style.textAlign = ""
                    }

                }
                cursor = iterator.nextNode()
            }

        } else {

            if (parent instanceof HTMLParagraphElement || parent instanceof HTMLHeadingElement) {
                if (value) {
                    parent.style.textAlign = this.textAlign === "start" ? "" : this.textAlign
                } else {
                    parent.style.textAlign = ""
                }
            } else {
                if (value) {
                    grandParent.style.textAlign = this.textAlign === "start" ? "" : this.textAlign
                } else {
                    grandParent.style.textAlign = ""
                }
            }



        }
    }


}