import {AbstractNode, RootNode} from "../../shared/core/TreeNode";
import WysiwygState from "../../shared/contexts/WysiwygState";

export interface KeyCommand {
    type : string
    source: AbstractNode
    handle: () => void
}

export interface CommandRule<A extends AbstractNode> {
    test(value: WysiwygState.GeneralEvent, node: AbstractNode, cursor: AbstractNode): boolean

    process(currentCursor: { container: AbstractNode; offset: number }, node: A, currentEvent: WysiwygState.GeneralEvent, root: RootNode): void
}