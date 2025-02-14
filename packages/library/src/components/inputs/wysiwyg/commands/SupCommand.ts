import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class SupCommand extends AbstractFormatCommand<boolean> {

    get format(): string {
        return "sup";
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