import {AbstractProvider} from "../shared/AbstractProvider";
import Image from "./Image";
import {ImageNode} from "./ImageNode";
import ImageTool from "./ImageTool";

export class ImageProvider extends AbstractProvider<Image.Attributes, ImageTool.Attributes, typeof ImageNode> {

    icon: string = "image";

    title: string = "Image";

    component = Image

    tool = ImageTool

    get factory(): typeof ImageNode {
        return ImageNode
    }

}