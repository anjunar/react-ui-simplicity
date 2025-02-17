import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class ItalicCommand extends AbstractFormatCommand<boolean> {

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.classList.add("italic")
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.classList.remove("italic")
        }
    }


}