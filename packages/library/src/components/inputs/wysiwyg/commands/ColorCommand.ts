import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class ColorCommand extends AbstractFormatCommand<string> {

    addCallback(value: string): (element: HTMLElement) => void {
        return (element) => {
            element.style.color = value
        }
    }

    removeCallback(value: string): (element: HTMLElement) => void {
        return (element) => {
            element.style.color = ""
        }
    }

}