import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class SubCommand extends AbstractFormatCommand<boolean> {
    get format(): string {
        return "sub";
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