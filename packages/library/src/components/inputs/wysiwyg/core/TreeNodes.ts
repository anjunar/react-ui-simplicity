import {AbstractContainerNode, AbstractNode, RootNode, TextNode} from "./TreeNode";

export function findParent(node: AbstractNode, callback: (node: AbstractNode) => boolean) {

    if (callback(node)) {
        return node
    }

    if (node.parent) {
        return findParent(node.parent, callback)
    }
}

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

export function findNodeWithMaxDepth(
    node: AbstractNode,
    callback: (node: AbstractNode) => boolean,
    maxDepth: number,
    currentDepth: number = 0
): AbstractNode | undefined {
    if (currentDepth > maxDepth) {
        return undefined;
    }

    if (callback(node)) {
        return node;
    }

    if (node instanceof AbstractContainerNode) {
        for (const child of node.children) {
            let selectedNode = findNodeWithMaxDepth(child, callback, maxDepth, currentDepth + 1);
            if (selectedNode) {
                return selectedNode;
            }
        }
    }

    return undefined;
}


export function flatten(node : AbstractNode) : AbstractNode[] {
    if (node instanceof AbstractContainerNode) {
        return [node, ...node.children.flatMap(child => flatten(child))]
    } else {
        return [node]
    }
}

export function findNearestTextLeft(root: RootNode, parent: AbstractContainerNode<any>) {
    let flattened = root.flatten;
    let indexOf = flattened.indexOf(parent.children[parent.children.length - 1])
    return flattened.find((node, index) => index > indexOf && node instanceof TextNode);
}

export function findNearestTextRight(root: RootNode, parent: AbstractContainerNode<any>) {
    let flattened = root.flatten;
    let indexOf = flattened.indexOf(parent);
    return flattened.findLast((node, index) => index < indexOf && node instanceof TextNode);
}

