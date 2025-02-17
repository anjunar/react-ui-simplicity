import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class SupCommand extends AbstractFormatCommand<boolean> {

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.classList.add("sup")
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.classList.remove("sup")
        }
    }

}