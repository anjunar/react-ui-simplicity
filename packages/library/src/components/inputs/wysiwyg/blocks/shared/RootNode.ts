import {AbstractNode} from "./AbstractNode";

export class RootNode {

    blocks : AbstractNode<any>[]

    constructor(blocks: AbstractNode<any>[] = []) {
        this.blocks = blocks;
    }

}