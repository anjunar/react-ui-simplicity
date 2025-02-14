import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class BoldCommand extends AbstractFormatCommand {

    get format(): string {
        return "bold"
    }

}