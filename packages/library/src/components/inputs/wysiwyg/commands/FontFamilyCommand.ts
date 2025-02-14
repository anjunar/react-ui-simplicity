import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class FontFamilyCommand extends AbstractFormatCommand<string> {

    removeCallback(value: string): (element: HTMLElement) => void {
        return (element) => {
            element.style.fontFamily = value
        }
    }

    addCallback(value: string): (element: HTMLElement) => void {
        return (element) => {
            element.style.fontFamily = value
        }
    }
}