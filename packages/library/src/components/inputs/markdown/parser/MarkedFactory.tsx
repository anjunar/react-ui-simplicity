import MarkDown from "../MarkDown";
import EditorModel = MarkDown.EditorModel;
import {Marked, Token} from "marked";

export function factory(model : EditorModel) {
    let marked = new Marked();

    const renderer = {
        image({href, title, text} : {href : string, title : string, text : string}) : string {
            const imageData = model.store.files.find(file => file.name === href)

            return `<img src="${imageData.data}" style="width: 100%" alt="${text}" title="${title || ''}">`;
        }
    };

    marked.use({ renderer });

    return marked
}

const inlineElements = ["text", "escape", "html", "strong", "em", "codespan", "br", "del", "link", "image", "footnote"]


export function findNodesByOffsets(ast: Token[], startOffset: number, endOffset: number, index: number = 0): Token[] {
    const results: Token[] = [];

    function traverse(token: Token, start: number): void {
        let innerTokens: Token[] | undefined;

        switch (token.type) {
            case "list":
                innerTokens = token["items"];
                break;
            case "table":
                innerTokens = token["rows"];
                break;
            default:
                if (Reflect.has(token, "tokens")) {
                    innerTokens = token["tokens"];
                }
                break;
        }

        if (innerTokens) {
            const childRaw = innerTokens.map(t => t.raw ?? "").join("");
            const offset = token.raw.indexOf(childRaw);
            const adjustedStart = start + (offset >= 0 ? offset : 0);
            results.push(...findNodesByOffsets(innerTokens, startOffset, endOffset, adjustedStart));
        }
    }

    for (const token of ast) {
        const start = index;
        const end = index + (token.raw?.length ?? 0);

        const overlaps =
            (start >= startOffset && start < endOffset) ||
            (end > startOffset && end <= endOffset) ||
            (start <= startOffset && end >= endOffset);

        if (overlaps) {
            if (inlineElements.indexOf(token.type) === -1 || (token.type === "text" && Reflect.has(token, "tokens"))) {
                traverse(token, start);
            } else {
                results.push(token)
            }
        } else {
            traverse(token, start);
        }

        index = end;
    }

    return results;
}