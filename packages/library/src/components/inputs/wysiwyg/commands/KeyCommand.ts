import {AbstractNode, RootNode} from "../core/TreeNode";
import {GeneralEvent} from "../EditorState";

export interface KeyCommand {
    type : string
    source: AbstractNode
    handle: () => void
}

export interface CommandRule<A extends AbstractNode> {
    test(value: GeneralEvent, node: AbstractNode, cursor: AbstractNode): boolean

    process(currentCursor: { container: AbstractNode; offset: number }, node: A, currentEvent: GeneralEvent, root: RootNode): void
}