import { Node } from 'unist';

export function unwrapFormatInline(nodes: Node[], typeToRemove: string): void {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if ('children' in node && Array.isArray(node.children)) {
            unwrapFormatInline(node.children, typeToRemove);
        }

        if (node.type === typeToRemove && 'children' in node && Array.isArray(node.children)) {
            nodes.splice(i, 1, ...node.children);
            i += node.children.length - 1;
        }
    }
}

export abstract class AbstractCommand {

    abstract execute(state : boolean, cursor : Node[], textArea : HTMLTextAreaElement) : void

}

export class BoldCommand extends AbstractCommand {

    execute(state : boolean, cursor : Node[], textArea : HTMLTextAreaElement) : void {

        if (state) {
            unwrapFormatInline(cursor, "strong")
        } else {
            let pre = textArea.value.substring(0, textArea.selectionStart)
            let selection = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd)
            let post = textArea.value.substring(textArea.selectionEnd)

            textArea.value = `${pre}**${selection}**${post}`

            const event = new Event('input', {bubbles: true, cancelable: true})

            textArea.dispatchEvent(event);

        }

    }

}

export class ItalicCommand extends AbstractCommand {

    execute(state : boolean, cursor : Node[], textArea : HTMLTextAreaElement) : void {

        if (state) {
            unwrapFormatInline(cursor, "emphasis")
        } else {
            let pre = textArea.value.substring(0, textArea.selectionStart)
            let selection = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd)
            let post = textArea.value.substring(textArea.selectionEnd)

            textArea.value = `${pre}*${selection}*${post}`

            const event = new Event('input', {bubbles: true, cancelable: true})

            textArea.dispatchEvent(event);

        }

    }

}
