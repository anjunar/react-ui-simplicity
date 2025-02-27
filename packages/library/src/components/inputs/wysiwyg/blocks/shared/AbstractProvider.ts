import React from "react";

export abstract class AbstractProvider<C, T, N extends new (...args: any[]) => any> {

    abstract title: string

    abstract icon : string

    abstract component: ((properties: C) => React.JSX.Element)

    abstract tool: ((properties: T) => React.JSX.Element)

    abstract get factory(): N

}