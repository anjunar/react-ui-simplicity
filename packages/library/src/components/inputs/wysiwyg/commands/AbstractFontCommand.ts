import {AbstractCommand} from "./AbstractCommand";

export abstract class AbstractFontCommand extends AbstractCommand<string> {

    inherit(node: HTMLElement, parent: HTMLElement): void {
        if (! parent.hasAttribute("contentEditable")) {
            node.setAttribute("style", parent.getAttribute("style"))
        }
    }


}