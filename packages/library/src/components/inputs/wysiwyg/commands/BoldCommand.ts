import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class BoldCommand extends AbstractFormatCommand<boolean>{

    get format(): string {
        return "bold"
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