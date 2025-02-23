import Paragraph from "./Paragraph";
import {AbstractProvider} from "../AbstractProvider";
import {ParagraphNode} from "./ParagraphNode";

export class ParagraphProvider extends AbstractProvider<Paragraph.Attributes, typeof ParagraphNode> {

    title = "Text"

    icon = "abc"

    component = Paragraph

    get factory(): typeof ParagraphNode {
        return ParagraphNode
    }

}