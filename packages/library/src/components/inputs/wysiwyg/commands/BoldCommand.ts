import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class BoldCommand extends AbstractFormatCommand<boolean>{

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.style.fontWeight = "bold"
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.style.fontWeight = ""
        }
    }

}