import {AbstractCommand} from "./AbstractCommand";

export class AddListCommand extends AbstractCommand<HTMLElement> {

    constructor() {
        super();

        let range = this.range;

        let container = range.startContainer.parentElement.closest("h1, h2, h3, h4, h5, h6, p, ul");

        this.execute(container as HTMLElement)

    }

    execute(value: HTMLElement): void {
        let range = this.range;

        if (range.collapsed) {

            let listElement = document.createElement("ul");
            let liElement = document.createElement("li");
            let paragraphElement = document.createElement("p");
            let spanElement1 = document.createElement("span");
            spanElement1.appendChild(document.createElement("br"))
            paragraphElement.appendChild(spanElement1)
            liElement.appendChild(paragraphElement)
            listElement.appendChild(liElement)
            value.after(listElement)


        }

    }

}