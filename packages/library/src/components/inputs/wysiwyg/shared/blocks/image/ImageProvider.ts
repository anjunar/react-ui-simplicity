import {AbstractProvider} from "../shared/AbstractProvider";
import ImageProcessor from "./ImageProcessor";
import {ImageCommand} from "./ImageCommand";
import ImageTool from "./ImageTool";

export class ImageProvider extends AbstractProvider<typeof ImageCommand, ImageProcessor.Attributes, ImageTool.Attributes> {
    type: string = "image";
    icon: string = "image";
    title: string = "Image";
    command = ImageCommand;
    processor = ImageProcessor;
    tool = ImageTool;
}