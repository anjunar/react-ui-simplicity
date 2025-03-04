import {AbstractNode} from "../../core/TreeNode";

export class ImageNode extends AbstractNode {
    type: string = "image";

    src : string = "";
}