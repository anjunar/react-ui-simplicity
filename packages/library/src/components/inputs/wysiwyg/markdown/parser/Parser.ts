import {Token} from "./Token";
import {tokenizer} from "./Tokenizer";
import {ParagraphNode} from "../../shared/blocks/paragraph/ParagraphNode";
import {AbstractNode, RootNode, TextNode} from "../../shared/core/TreeNode";
import {ItemNode, ListNode} from "../../shared/blocks/list/ListNode";

class Iterator<E> {

    array : E[]

    index = -1

    constructor(array: E[]) {
        this.array = array;
    }

    next() : E {
        return this.array[++this.index]
    }

    lookAhead(value : number) : E {
        return this.array[this.index + value]
    }

    current() : E {
        return this.array[this.index]
    }

    last() : E {
        return this.array[--this.index]
    }

    get hasNext() {
        return this.index < this.array.length
    }
}

function isText(result : Token) {
    return result.type === "h1" ||
        result.type === "h2" ||
        result.type === "h3" ||
        result.type === "text" ||
        result.type === "bold" ||
        result.type === "italic" ||
        result.type === "bold-italic"

}

function parseUnorderedList(iterator: Iterator<Token>, depth = 0) : ListNode {

    let unorderedListNode = new ListNode()

    let token = iterator.current()

    while (iterator.hasNext && token.type === "ul") {

        let itemNode : ItemNode
        if (token?.value.length > depth) {
            let item = unorderedListNode.children.findLast(node => node instanceof ItemNode);
            if (item) {
                item.appendChild(parseUnorderedList(iterator, token.value.length))
            } else  {
                token = iterator.next()
                itemNode = new ItemNode(parse(iterator))
                unorderedListNode.appendChild(itemNode)
            }
        } else if (token.value.length === depth) {
            token = iterator.next();
            itemNode = new ItemNode(parse(iterator));
            unorderedListNode.appendChild(itemNode);
        } else {
            token = iterator.last()
            break;
        }

        let lookAhead = iterator.lookAhead(1);
        if (lookAhead?.type === "ul") {
            token = iterator.next()
        } else {
            token = iterator.current()
        }

    }

    return unorderedListNode
}

function parseParagraph(iterator: Iterator<Token>) : ParagraphNode {

    let paragraphNode = new ParagraphNode()

    let token = iterator.current()

    while (iterator.hasNext && isText(token)) {
        switch (token.type) {
            case "h1" : {
                let textNode = new TextNode(token.value);
                textNode.block = "h1"
                textNode.markdown = {node : textNode, start : token.startOffset, end : token.endOffset}
                paragraphNode.appendChild(textNode)
            } break
            case "h2" : {
                let textNode = new TextNode(token.value);
                textNode.block = "h2"
                textNode.markdown = {node : textNode, start : token.startOffset, end : token.endOffset}
                paragraphNode.appendChild(textNode)
            } break
            case "h3" : {
                let textNode = new TextNode(token.value);
                textNode.block = "h3"
                textNode.markdown = {node : textNode, start : token.startOffset, end : token.endOffset}
                paragraphNode.appendChild(textNode)
            } break
            case "text" : {
                let textNode = new TextNode(token.value);
                textNode.markdown = {node : textNode, start : token.startOffset, end : token.endOffset}
                paragraphNode.appendChild(textNode)
            } break
            case "bold" : {
                let textNode = new TextNode(token.value);
                textNode.bold = true
                textNode.markdown = {node : textNode, start : token.startOffset, end : token.endOffset}
                paragraphNode.appendChild(textNode)
            } break
            case "italic" : {
                let textNode = new TextNode(token.value);
                textNode.italic = true
                textNode.markdown = {node : textNode, start : token.startOffset, end : token.endOffset}
                paragraphNode.appendChild(textNode)
            } break
            case "bold-italic" : {
                let textNode = new TextNode(token.value);
                textNode.bold = true
                textNode.italic = true
                textNode.markdown = {node : textNode, start : token.startOffset, end : token.endOffset}
                paragraphNode.appendChild(textNode)
            } break
        }

        token = iterator.next()
    }

    return paragraphNode
}

function parse(iterator: Iterator<Token>) {

    let token = iterator.current()

    if (iterator.hasNext) {
        switch (token.type) {
            case "h1" :
            case "h2" :
            case "h3" :
            case "text" :
            case "bold" :
            case "italic" :
            case "bold-italic" : {
                return [parseParagraph(iterator)]
            }
            case "ul" : {
                return [parseUnorderedList(iterator)]
            }
            case "newLine" : {
                return parseRoot(iterator)
            }
        }
    } else {
        return []
    }

}

function parseRoot(iterator : Iterator<Token>) : AbstractNode[] {

    let nodes : AbstractNode[] = []

    let token = iterator.next()

    while (iterator.hasNext) {
        nodes.push(...parse(iterator));

        token = iterator.next()
    }

    return nodes
}

export function parseString(text : string) {

    let tokens = tokenizer(text);

    let iterator = new Iterator(tokens);

    let node = parseRoot(iterator);

    if (node.length === 0) {
        return new RootNode([new ParagraphNode([new TextNode("")])])
    }

    return new RootNode(node)

}
