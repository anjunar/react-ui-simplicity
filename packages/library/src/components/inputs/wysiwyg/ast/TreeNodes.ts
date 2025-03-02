import {AbstractContainerNode, AbstractNode} from "./TreeNode";

export function findNode(node: AbstractNode, callback: (node: AbstractNode) => boolean) {

    if (callback(node)) {
        return node
    }

    if (node instanceof AbstractContainerNode) {
        for (const child of node.children) {
            let selectedNode = findNode(child, callback);
            if (selectedNode) {
                return selectedNode
            }
        }
    }
}

export function flatten(node : AbstractNode) : AbstractNode[] {
    if (node instanceof AbstractContainerNode) {
        return [node, ...node.children.flatMap(child => flatten(child)), node]
    } else {
        return [node]
    }
}