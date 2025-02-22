import {AbstractCommand} from "./AbstractCommand";

export class AddLiCommand extends AbstractCommand<HTMLElement> {

    execute(value: HTMLElement): void {
        let liElement = document.createElement("li");
        let pElement = document.createElement("p");
        let spanElement = document.createElement("span");
        spanElement.appendChild(document.createElement("br"))
        pElement.appendChild(spanElement)
        liElement.appendChild(pElement)
        value.after(liElement)
    }

}