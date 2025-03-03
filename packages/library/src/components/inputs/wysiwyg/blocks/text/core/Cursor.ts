import {AbstractTreeNode} from "./TreeNode";

export interface CursorState {
    container: AbstractTreeNode
    offset: number
}

export interface CursorHolder {
    currentCursor: CursorState
}