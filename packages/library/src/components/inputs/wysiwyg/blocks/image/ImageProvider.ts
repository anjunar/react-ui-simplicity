import {AbstractProvider} from "../AbstractProvider";
import Image from "./Image";
import {ImageNode} from "./ImageNode";

export class ImageProvider extends AbstractProvider<Image.Attributes, typeof ImageNode> {

    icon: string = "image";

    title: string = "Image";

    component = Image

    get factory(): typeof ImageNode {
        return ImageNode
    }

}