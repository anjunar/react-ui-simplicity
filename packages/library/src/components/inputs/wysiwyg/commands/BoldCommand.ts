import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class BoldCommand extends AbstractFormatCommand<boolean>{

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.classList.add("bold")
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.classList.remove("bold")
        }
    }

}