import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class SupCommand extends AbstractFormatCommand<boolean> {

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.style.verticalAlign = "super"
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.style.verticalAlign = ""
        }
    }

}