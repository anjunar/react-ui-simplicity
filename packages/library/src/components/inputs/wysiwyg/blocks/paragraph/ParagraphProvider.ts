import Paragraph from "./Paragraph";
import {AbstractProvider} from "../shared/AbstractProvider";
import {ParagraphNode} from "./ParagraphNode";
import TextTool from "../shared/TextTool";

export class ParagraphProvider extends AbstractProvider<Paragraph.Attributes, TextTool.Attributes, typeof ParagraphNode> {

    title = "Text"

    icon = "abc"

    component = Paragraph

    tool = TextTool

    get factory(): typeof ParagraphNode {
        return ParagraphNode
    }

}