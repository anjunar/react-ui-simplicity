import {AbstractCommand} from "./AbstractCommand";

export abstract class AbstractFormatCommand extends AbstractCommand<boolean> {

    abstract get format(): string

    inherit(node: HTMLElement, parent: HTMLElement) {
        node.className = parent.className
    }

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.classList.add(this.format)
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.classList.remove(this.format)
        }
    }

}