import {AbstractProvider} from "../AbstractProvider";
import Header from "./Header";
import {HeaderNode} from "./HeaderNode";

export class HeaderProvider extends AbstractProvider<Header.Attributes, typeof HeaderNode> {

    title = "Header"

    icon = "title"

    component = Header

    get factory(): typeof HeaderNode {
        return HeaderNode
    }

}