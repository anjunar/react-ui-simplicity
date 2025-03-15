import {AbstractContainerNode, AbstractNode, TextNode} from "../../shared/core/TreeNode";
import {ItemNode, ListNode} from "../../shared/blocks/list/ListNode";
import {ParagraphNode} from "../../shared/blocks/paragraph/ParagraphNode";

export interface NodeRange {
    node: AbstractNode;
    start: number;
    end: number;
}

export function flattenAST(ast: ReadonlyArray<AbstractNode>): NodeRange[] {
    let offset = 0;
    let nodes: NodeRange[] = [];

    function traverse(node: AbstractNode) {

        if (node instanceof TextNode) {
            nodes.push(node.markdown)
        }

        if (node instanceof AbstractContainerNode) {
            node.children.forEach(traverse);
        }


    }

    ast.forEach(traverse);
    return nodes;
}

export function findSelectedNodes(nodes: NodeRange[], selectionStart: number, selectionEnd: number): NodeRange[] {
    return nodes.filter(({start, end}) => selectionStart < end && selectionEnd > start)
}