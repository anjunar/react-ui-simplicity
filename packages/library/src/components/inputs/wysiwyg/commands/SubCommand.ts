import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class SubCommand extends AbstractFormatCommand<boolean> {

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.style.verticalAlign = "sub"
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.style.verticalAlign = ""
        }
    }

}