import {AbstractNode} from "../core/TreeNode";

export interface EventCommand {
    source : AbstractNode
    handle : () => void
}