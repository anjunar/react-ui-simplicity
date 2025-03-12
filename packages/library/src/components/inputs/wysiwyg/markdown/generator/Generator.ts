import {AbstractNode, RootNode, TextNode} from "../../core/TreeNode";
import {match} from "../../../../../pattern-match/PatternMatching";
import {ParagraphNode} from "../../blocks/paragraph/ParagraphNode";
import {ItemNode, ListNode} from "../../blocks/list/ListNode";

function generateText(node: TextNode) {

    if (node.block) {
        switch (node.block) {
            case "h1" : return `# ${node.text}`
            case "h2" : return `## ${node.text}`
            case "h3" : return `### ${node.text}`
        }
    }

    if (node.bold && node.italic) {
        return `***${node.text}***`
    }

    if (node.bold) {
        return `**${node.text}**`
    }

    if (node.italic) {
        return `*${node.text}*`
    }

    return node.text;
}

export function generate(root : AbstractNode) : string {
    return match<AbstractNode, string>(root)
        .with(RootNode, node => node.children.map(node => generate(node)).join("\n"))
        .with(ParagraphNode, node => node.children.map(node => generate(node)).join("\n"))
        .with(TextNode, (node) => generateText(node))
        .with(ListNode, node => node.children.map(node => generate(node)).join("\n"))
        .with(ItemNode, node => node.children.map(node => generate(node)).join("\n"))
        .nonExhaustive()

}