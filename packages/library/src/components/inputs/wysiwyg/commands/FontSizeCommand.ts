import {AbstractFontCommand} from "./AbstractFontCommand";

export class FontSizeCommand extends AbstractFontCommand {

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