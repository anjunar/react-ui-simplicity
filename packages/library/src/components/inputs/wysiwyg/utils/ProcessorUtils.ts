import {AbstractContainerNode, AbstractNode, RootNode, TextNode} from "../core/TreeNode";

export function onArrowLeft(root: RootNode, current: { container: AbstractNode; offset: number }) {
    let flattened = root.flatten
    let indexOf = flattened.indexOf(current.container);
    if (indexOf > 0) {
        current.container = flattened[indexOf - 1]
        if (current.container instanceof TextNode) {
            current.offset = current.container.text.length
        } else {
            current.offset = 0
        }
    }
}

export function onArrowRight(root: RootNode, current: { container: AbstractNode; offset: number }) {
    let flattened = root.flatten
    let indexOf = flattened.lastIndexOf(current.container);
    if (indexOf < flattened.length - 1) {
        current.container = flattened[indexOf + 1]
        current.offset = 0
    }
}

export function onArrowUp(node: TextNode, current: { container: AbstractNode; offset: number }) {
    let parent = node.parent;
    if (parent) {
        let grandParent = parent.parent;
        if (grandParent) {
            const parentIndex = parent.parentIndex;
            if (parentIndex > -1) {
                const siblingAbove = grandParent.children[parentIndex - 1];
                if (siblingAbove instanceof AbstractContainerNode) {

                    let remainingOffset = parent
                        .children
                        .slice(0, node.parentIndex)
                        .reduce((acc, child) => acc + (child as TextNode).text.length, 0) + current.offset;

                    for (const child of siblingAbove.children) {
                        const textLength = (child as TextNode).text.length;

                        if (remainingOffset <= textLength) {
                            current.container = child;
                            current.offset = remainingOffset;
                            return;
                        }

                        remainingOffset -= textLength;
                    }

                    const lastTextNode = siblingAbove.children[siblingAbove.children.length - 1] as TextNode;
                    if (lastTextNode) {
                        current.container = lastTextNode;
                        current.offset = lastTextNode.text.length;
                    }
                }
            }
        }
    }
}

export function onArrowDown(node: TextNode, current: { container: AbstractNode; offset: number }) {
    let parent = node.parent;
    if (parent) {
        let grandParent = parent.parent;
        if (grandParent) {
            const parentIndex = parent.parentIndex;
            if (parentIndex >= 0 && parentIndex < grandParent.children.length - 1) {
                const siblingBelow = grandParent.children[parentIndex + 1];
                if (siblingBelow instanceof AbstractContainerNode) {

                    let remainingOffset = parent
                        .children
                        .slice(0, node.parentIndex)
                        .reduce((acc, child) => acc + (child as TextNode).text.length, 0) + current.offset;

                    for (const child of siblingBelow.children) {
                        const textLength = (child as TextNode).text.length;

                        if (remainingOffset <= textLength) {
                            current.container = child;
                            current.offset = remainingOffset;
                            return;
                        }

                        remainingOffset -= textLength;
                    }

                    const lastTextNode = siblingBelow.children[siblingBelow.children.length - 1] as TextNode;
                    if (lastTextNode) {
                        current.container = lastTextNode;
                        current.offset = lastTextNode.text.length;
                    }
                }
            }
        }
    }
}


