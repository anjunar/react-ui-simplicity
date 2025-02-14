import {AbstractJustifyCommand} from "./AbstractJustifyCommand";

export class JustifyLeftCommand extends AbstractJustifyCommand {

    get textAlign() {
        return "start"
    }

}