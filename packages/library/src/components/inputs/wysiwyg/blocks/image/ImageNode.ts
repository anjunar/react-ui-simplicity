import {AbstractNode} from "../../core/TreeNode";

export class ImageNode extends AbstractNode {
    type: string = "image";
    src : string = ""
    aspectRatio : number = 1
    width : number = 360
    height : number = 360
}