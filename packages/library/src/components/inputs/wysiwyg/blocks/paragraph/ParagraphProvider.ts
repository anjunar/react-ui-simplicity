import {AbstractProvider} from "../shared/AbstractProvider";
import ParagraphProcessor from "./ParagraphProcessor";
import ParagraphTool from "./ParagraphTool";
import {ParagraphCommand} from "./ParagraphCommand";

export class ParagraphProvider extends AbstractProvider<typeof ParagraphCommand, ParagraphProcessor.Attributes, ParagraphTool.Attributes> {

    command = ParagraphCommand

    icon: string = "abc"

    processor = ParagraphProcessor

    title = "Paragraph"

    tool = ParagraphTool

    type = "p"


}