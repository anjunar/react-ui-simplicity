import {AbstractFormatCommand} from "./AbstractFormatCommand";

export class SubCommand extends AbstractFormatCommand {
    get format(): string {
        return "sub";
    }

}