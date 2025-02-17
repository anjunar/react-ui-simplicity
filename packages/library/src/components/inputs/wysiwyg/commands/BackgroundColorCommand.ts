import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class BackgroundColorCommand extends AbstractFormatCommand<string> {

    addCallback(value: string): (element: HTMLElement) => void {
        return (element) => {
            element.style.backgroundColor = value
        }
    }

    removeCallback(value: string): (element: HTMLElement) => void {
        return (element) => {
            element.style.backgroundColor = ""
        }
    }

}