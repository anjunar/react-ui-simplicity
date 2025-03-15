import {AbstractCommand} from "./AbstractCommand";
import {NodeRange} from "../selection/ASTSelection";

export class BoldCommand extends AbstractCommand {
    execute(value : boolean, textarea : HTMLTextAreaElement,  markdown : {currentMarkdown : string, triggerMarkdown() : void}): void {

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        let wrapper = "**"

        if (value) {
            markdown.currentMarkdown = text.slice(0, start) + wrapper + text.slice(start, end) + wrapper + text.slice(end);

            const offset = wrapper.length;
            textarea.selectionStart = start + offset;
            textarea.selectionEnd = end + offset;
        }


    }

}

export class ItalicCommand extends AbstractCommand {
    execute(value : boolean, textarea : HTMLTextAreaElement,  markdown : {currentMarkdown : string, triggerMarkdown() : void}): void {

        let wrapper = "*"

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

export class BoldItalicCommand extends AbstractCommand {
    execute(value : boolean, textarea : HTMLTextAreaElement,  markdown : {currentMarkdown : string, triggerMarkdown() : void}): void {

        let wrapper = "***"

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