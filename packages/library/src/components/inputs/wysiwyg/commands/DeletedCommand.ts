import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class DeletedCommand extends AbstractFormatCommand<boolean> {

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.classList.add("deleted")
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.classList.remove("deleted")
        }
    }

}