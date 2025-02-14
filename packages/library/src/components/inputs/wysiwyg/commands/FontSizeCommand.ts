import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class FontSizeCommand extends AbstractFormatCommand<string> {

    removeCallback(value: string): (element: HTMLElement) => void {
        return (element) => {
            element.style.fontSize = value
        }
    }

    addCallback(value: string): (element: HTMLElement) => void {
        return (element) => {
            element.style.fontSize = value
        }
    }

}