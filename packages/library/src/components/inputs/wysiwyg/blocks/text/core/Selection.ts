import {AbstractTreeNode} from "./TreeNode";

export interface SelectionState {
    startContainer : AbstractTreeNode
    startOffset : number
    endContainer : AbstractTreeNode
    endOffset : number
}

export interface SelectionHolder {
    currentSelection: SelectionState
}