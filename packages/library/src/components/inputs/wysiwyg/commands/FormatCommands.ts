import {AbstractFormatCommand} from "./Command";

export class BoldCommand extends AbstractFormatCommand {
    format = "bold";
}

export class DeletedCommand extends AbstractFormatCommand {
    format = "deleted";
}

export class ItalicCommand extends AbstractFormatCommand {
    format = "italic";
}

export class SubCommand extends AbstractFormatCommand {
    format = "sub";
}

export class SupCommand extends AbstractFormatCommand {
    format = "sup";
}