import {AbstractProvider} from "../shared/AbstractProvider";
import ImageProcessor from "./ImageProcessor";
import {ImageCommand} from "./ImageCommand";

export class ImageProvider extends AbstractProvider<typeof ImageCommand, ImageProcessor.Attributes> {
    type: string = "image";
    icon: string = "image";
    title: string = "Image";
    command = ImageCommand;
    processor = ImageProcessor;
}