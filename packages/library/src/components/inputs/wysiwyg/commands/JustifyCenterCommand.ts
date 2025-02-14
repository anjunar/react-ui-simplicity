import {AbstractJustifyCommand} from "./AbstractJustifyCommand";

export class JustifyCenterCommand extends AbstractJustifyCommand {

    get textAlign() {
        return "center"
    }

}