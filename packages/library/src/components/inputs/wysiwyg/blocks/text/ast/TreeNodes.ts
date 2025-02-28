import {AbstractContainerTreeNode, AbstractTreeNode} from "./TreeNode";

export function findNode(node: AbstractTreeNode, callback: (node: AbstractTreeNode) => boolean) {

    if (callback(node)) {
        return node
    }

    if (node instanceof AbstractContainerTreeNode) {
        for (const child of node.children) {
            let selectedNode = findNode(child, callback);
            if (selectedNode) {
                return selectedNode
            }
        }
    }
}

export function flatten(node : AbstractTreeNode) : AbstractTreeNode[] {
    if (node instanceof AbstractContainerTreeNode) {
        return [node, ...node.children.flatMap(child => flatten(child))]
    } else {
        return [node]
    }
}