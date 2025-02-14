import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class DeletedCommand extends AbstractFormatCommand<boolean> {
    get format(): string {
        return "deleted";
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