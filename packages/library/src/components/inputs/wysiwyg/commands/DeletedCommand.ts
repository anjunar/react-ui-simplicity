import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class DeletedCommand extends AbstractFormatCommand<boolean> {

    addCallback(value : boolean) {
        return (element: HTMLElement) => {
            element.style.textDecoration = "line-through"
        }
    }

    removeCallback(value :boolean){
        return (element: HTMLElement) => {
            element.style.textDecoration = ""
        }
    }

}