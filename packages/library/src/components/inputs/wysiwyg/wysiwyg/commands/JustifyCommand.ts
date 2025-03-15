import {AbstractCommand} from "./AbstractCommands";
import WysiwygState from "../../shared/contexts/WysiwygState";
import EditorState from "../../shared/contexts/EditorState";

export class JustifyCommand extends AbstractCommand<string> {

    execute(value: string, context: WysiwygState.Context, editor : EditorState.Context): void {

        const { cursor : {currentCursor} } = context;

        const { ast : {triggerAST}} = editor

        if (currentCursor) {

            let parent = currentCursor.container.parent;

            parent.justify = value

            triggerAST()

        }

    }

}