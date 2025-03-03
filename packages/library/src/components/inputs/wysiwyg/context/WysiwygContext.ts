import React from "react";
import {AbstractProvider} from "../blocks/shared/AbstractProvider";
import {RootNode} from "../blocks/shared/RootNode";

export interface WysiwygScope {
    providers : AbstractProvider<any, any, any>[]
    ast : RootNode
    trigger() : void
}

export const WysiwygContext = React.createContext<WysiwygScope>({ast : null, trigger: null, providers : []})