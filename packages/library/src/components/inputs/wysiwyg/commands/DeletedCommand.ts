import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class DeletedCommand extends AbstractFormatCommand {
    get format(): string {
        return "deleted";
    }
}