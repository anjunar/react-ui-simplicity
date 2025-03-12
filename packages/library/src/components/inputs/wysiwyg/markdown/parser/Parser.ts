import {Literal} from "./Literal";
import {tokenizer} from "./Tokenizer";
import {ParagraphNode} from "../../blocks/paragraph/ParagraphNode";
import {AbstractNode, RootNode, TextNode} from "../../core/TreeNode";
import {ItemNode, ListNode} from "../../blocks/list/ListNode";

class Iterator<E> {

    array : E[]

    index = -1

    constructor(array: E[]) {
        this.array = array;
    }

    next() : E {
        return this.array[++this.index]
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

function isText(result : Literal) {
    return result.type === "h1" ||
        result.type === "h2" ||
        result.type === "h3" ||
        result.type === "text" ||
        result.type === "bold" ||
        result.type === "italic" ||
        result.type === "bold-italic"

}

function parseUnorderedList(iterator: Iterator<Literal>, depth = 0) : ListNode {

    let unorderedListNode = new ListNode()

    let token = iterator.current()

    while (iterator.hasNext && token.type === "ul") {

        let itemNode : ItemNode
        if (token?.value.length !== depth) {
            itemNode = new ItemNode([parseUnorderedList(iterator, token.value.length)])
        } else {
            token = iterator.next()
            itemNode = new ItemNode(parse(iterator))
        }

        unorderedListNode.appendChild(itemNode)
        token = iterator.next()

    }

    return unorderedListNode
}

function parseParagraph(iterator: Iterator<Literal>) : ParagraphNode {

    let paragraphNode = new ParagraphNode()

    let token = iterator.current()

    while (iterator.hasNext && isText(token)) {
        switch (token.type) {
            case "h1" : {
                let textNode = new TextNode(token.value);
                textNode.block = "h1"
                paragraphNode.appendChild(textNode)
            } break
            case "h2" : {
                let textNode = new TextNode(token.value);
                textNode.block = "h2"
                paragraphNode.appendChild(textNode)
            } break
            case "h3" : {
                let textNode = new TextNode(token.value);
                textNode.block = "h3"
                paragraphNode.appendChild(textNode)
            } break
            case "text" : {
                paragraphNode.appendChild(new TextNode(token.value))
            } break
            case "bold" : {
                let textNode = new TextNode(token.value);
                textNode.bold = true
                paragraphNode.appendChild(textNode)
            } break
            case "italic" : {
                let textNode = new TextNode(token.value);
                textNode.italic = true
                paragraphNode.appendChild(textNode)
            } break
            case "bold-italic" : {
                let textNode = new TextNode(token.value);
                textNode.bold = true
                textNode.italic = true
                paragraphNode.appendChild(textNode)
            } break
        }

        token = iterator.next()
    }

    return paragraphNode
}

function parse(iterator: Iterator<Literal>) {

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

function parseRoot(iterator : Iterator<Literal>) : AbstractNode[] {

    let nodes : AbstractNode[] = []

    let token = iterator.next()

    while (iterator.hasNext) {
        nodes.push(...parse(iterator));

        token = iterator.next()
    }

    return nodes
}

export function parseString(text : string) {

    let literals = tokenizer(text);

    let iterator = new Iterator(literals);

    let node = parseRoot(iterator);

    return new RootNode(node)

}