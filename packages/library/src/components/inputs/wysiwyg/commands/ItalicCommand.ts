import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class ItalicCommand extends AbstractFormatCommand<boolean> {

    get format(): string {
        return "italic"
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