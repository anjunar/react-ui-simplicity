import React from "react";
import {AbstractProvider} from "../blocks/AbstractProvider";
import {RootNode} from "../blocks/RootNode";

export interface WysiwygContext {
    providers : AbstractProvider<any, any, any>[]
    ast : RootNode
    trigger() : void
}

export const Context = React.createContext<WysiwygContext>({ast : null, trigger: null, providers : []})