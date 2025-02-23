import React from "react";

export abstract class AbstractProvider<P, T extends new (...args: any[]) => any> {

    abstract title: string

    abstract icon : string

    abstract component: ((properties: P) => React.JSX.Element)

    abstract get factory(): T

}