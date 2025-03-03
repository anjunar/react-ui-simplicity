import {createContext} from "react";
import {AbstractNode} from "../blocks/shared/AbstractNode";

export interface BlockScope {
    node : AbstractNode<any>
}

export const BlockContext = createContext<BlockScope>(null)