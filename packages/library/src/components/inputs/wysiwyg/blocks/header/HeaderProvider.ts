import {AbstractProvider} from "../shared/AbstractProvider";
import Header from "./Header";
import {HeaderNode} from "./HeaderNode";
import HeaderTool from "./HeaderTool";

export class HeaderProvider extends AbstractProvider<Header.Attributes, HeaderTool.Attributes, typeof HeaderNode> {

    title = "Header"

    icon = "title"

    component = Header

    tool = HeaderTool

    get factory(): typeof HeaderNode {
        return HeaderNode
    }

}