import {AbstractContainerTreeNode, AbstractTreeNode, ParagraphTreeNode, RootTreeNode, TextTreeNode} from "../ast/TreeNode";
import {GeneralEvent} from "../components/EditorContext";

export function onArrowLeft(root: RootTreeNode, current: { container: AbstractTreeNode; offset: number }) {
    let flattened = root.flatten
    let indexOf = flattened.indexOf(current.container);
    if (indexOf > 0) {
        current.container = flattened[indexOf - 1]
        if (current.container instanceof TextTreeNode) {
            current.offset = current.container.text.length
        } else {
            current.offset = 0
        }
    }
}

export function onArrowRight(root: RootTreeNode, current: { container: AbstractTreeNode; offset: number }) {
    let flattened = root.flatten
    let indexOf = flattened.lastIndexOf(current.container);
    if (indexOf < flattened.length - 1) {
        current.container = flattened[indexOf + 1]
        current.offset = 0
    }
}

export function arrowUp(node: TextTreeNode, current: { container: AbstractTreeNode; offset: number }) {
    let parent = node.parent;
    if (parent) {
        let grandParent = parent.parent;
        if (grandParent) {
            const parentIndex = parent.parentIndex;
            if (parentIndex > 0) {
                const siblingAbove = grandParent.children[parentIndex - 1];
                if (siblingAbove instanceof AbstractContainerTreeNode) {

                    let remainingOffset = current.offset;
                    for (const child of siblingAbove.children) {
                        const textLength = child.length;

                        if (remainingOffset <= textLength) {
                            current.container = child;
                            current.offset = remainingOffset;
                            return;
                        }

                        remainingOffset -= textLength;
                    }

                    const lastTextNode = siblingAbove.children[siblingAbove.children.length - 1] as TextTreeNode;
                    if (lastTextNode) {
                        current.container = lastTextNode;
                        current.offset = lastTextNode.text.length;
                    }
                }
            }
        }
    }
}

export function arrowDown(node: TextTreeNode, current: { container: AbstractTreeNode; offset: number }) {
    let parent = node.parent;
    if (parent) {
        let grandParent = parent.parent;
        if (grandParent) {
            const parentIndex = parent.parentIndex;
            if (parentIndex >= 0 && parentIndex < grandParent.children.length - 1) {
                const siblingBelow = grandParent.children[parentIndex + 1];
                if (siblingBelow instanceof AbstractContainerTreeNode) {

                    let remainingOffset = current.offset;
                    for (const child of siblingBelow.children) {
                        const textLength = child.length;

                        if (remainingOffset <= textLength) {
                            current.container = child;
                            current.offset = remainingOffset;
                            return;
                        }

                        remainingOffset -= textLength;
                    }

                    const lastTextNode = siblingBelow.children[siblingBelow.length - 1] as TextTreeNode;
                    if (lastTextNode) {
                        current.container = lastTextNode;
                        current.offset = lastTextNode.text.length;
                    }
                }
            }
        }
    }
}


