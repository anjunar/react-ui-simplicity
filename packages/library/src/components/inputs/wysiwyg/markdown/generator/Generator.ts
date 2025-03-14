import {AbstractNode, RootNode, TextNode} from "../../shared/core/TreeNode";
import {match} from "../../../../../pattern-match/PatternMatching";
import {ParagraphNode} from "../../shared/blocks/paragraph/ParagraphNode";
import {ItemNode, ListNode} from "../../shared/blocks/list/ListNode";

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

function generateList(node : ListNode, depth = 0) : string  {
    return node.children.map(node => " ".repeat(depth * 4) + "* " + node.children.map(node => generate(node, depth + 1)).join("\n")).join("\n")
}

export function generate(root : AbstractNode, depth = 0) : string {
    return match<AbstractNode, string>(root)
        .with(RootNode, node => node.children.map(node => generate(node)).join("\n"))
        .with(ParagraphNode, node => node.children.map(node => generate(node)).join(""))
        .with(TextNode, (node) => generateText(node))
        .with(ListNode, node => generateList(node, depth))
        .nonExhaustive()

}