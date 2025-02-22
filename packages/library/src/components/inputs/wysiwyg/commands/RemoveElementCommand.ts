import {AbstractCommand} from "./AbstractCommand";

export class RemoveElementCommand extends AbstractCommand<HTMLElement> {
    execute(value: HTMLElement): void {
        value.remove()
    }
}