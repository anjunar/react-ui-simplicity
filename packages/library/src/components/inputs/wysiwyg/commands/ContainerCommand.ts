import {AbstractCommand} from "./AbstractCommand";

export class ContainerCommand extends AbstractCommand<string> {
    execute(value: string): void {
        let range = this.range
        let oldRange = this.oldRange

        if (range.collapsed) {
            let startContainer = range.startContainer;
            let parent = startContainer.parentElement;
            let grandParent = parent.parentElement;

            let element = document.createElement(value);

            if (parent instanceof HTMLSpanElement) {
                element.appendChild(startContainer.parentElement)
                grandParent.replaceWith(element)
            } else {
                element.appendChild(startContainer)
                parent.replaceWith(element)
            }

        } else {



        }
    }

}