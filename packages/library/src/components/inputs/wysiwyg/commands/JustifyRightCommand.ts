import {AbstractJustifyCommand} from "./AbstractJustifyCommand";

export class JustifyRightCommand extends AbstractJustifyCommand {

    get textAlign() {
        return "end"
    }

}