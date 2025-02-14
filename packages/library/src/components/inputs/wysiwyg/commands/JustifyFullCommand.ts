import {AbstractJustifyCommand} from "./AbstractJustifyCommand";

export class JustifyFullCommand extends AbstractJustifyCommand {

    get textAlign() {
        return "justify"
    }

}