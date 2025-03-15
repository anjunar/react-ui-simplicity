import {AbstractCommand} from "./AbstractCommand";

export class BoldCommand extends AbstractCommand {
    execute(textarea : HTMLTextAreaElement,  markdown : {currentMarkdown : string, triggerMarkdown() : void}): void {

        let wrapper = "**"

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        markdown.currentMarkdown = text.slice(0, start) + wrapper + text.slice(start, end) + wrapper + text.slice(end);

        const offset = wrapper.length;
        textarea.selectionStart = start + offset;
        textarea.selectionEnd = end + offset;

        textarea.focus();
    }

}