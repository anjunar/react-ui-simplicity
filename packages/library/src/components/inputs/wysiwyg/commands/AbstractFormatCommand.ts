import {AbstractCommand} from "./AbstractCommand";

export abstract class AbstractFormatCommand extends AbstractCommand<boolean> {

    abstract get format(): string

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