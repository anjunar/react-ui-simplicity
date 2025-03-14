import {AbstractCommand} from "./AbstractCommands";
import {Context} from "../../EditorState";

export class JustifyCommand extends AbstractCommand<string> {

    execute(value: string, context: Context): void {

        const { ast : {triggerAST}, cursor : {currentCursor} } = context;

        if (currentCursor) {

            let parent = currentCursor.container.parent;

            parent.justify = value

            triggerAST()

        }

    }

}