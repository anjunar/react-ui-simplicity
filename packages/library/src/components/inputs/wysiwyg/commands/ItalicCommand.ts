import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class ItalicCommand extends AbstractFormatCommand {

    get format(): string {
        return "italic"
    }

}