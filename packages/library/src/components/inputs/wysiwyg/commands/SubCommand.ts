import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class SubCommand extends AbstractFormatCommand<boolean> {

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.classList.add("sub")
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.classList.remove("sub")
        }
    }

}