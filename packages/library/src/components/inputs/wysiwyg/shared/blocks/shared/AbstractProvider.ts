import React from "react";

export abstract class AbstractProvider<C extends new (...args: any[]) => any, P, T> {

    abstract type : string
    abstract icon: string
    abstract title: string

    abstract command: C

    abstract processor: ((properties: P) => React.JSX.Element)

    abstract tool : ((properties: T) => React.JSX.Element)

}