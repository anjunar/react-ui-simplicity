import { Context } from "../EditorContext";
import {AbstractCommand} from "./AbstractCommands";

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