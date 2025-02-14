import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class SupCommand extends AbstractFormatCommand {
    get format(): string {
        return "sup";
    }
}