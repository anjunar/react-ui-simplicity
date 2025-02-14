import {AbstractFontCommand} from "./AbstractFontCommand";

export class FontFamilyCommand extends AbstractFontCommand {

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