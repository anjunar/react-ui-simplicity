import Paragraph from "./Paragraph";
import {AbstractProvider} from "../AbstractProvider";
import {ParagraphNode} from "./ParagraphNode";
import ParagraphTool from "./ParagraphTool";

export class ParagraphProvider extends AbstractProvider<Paragraph.Attributes, ParagraphTool.Attributes, typeof ParagraphNode> {

    title = "Text"

    icon = "abc"

    component = Paragraph

    tool = ParagraphTool

    get factory(): typeof ParagraphNode {
        return ParagraphNode
    }

}