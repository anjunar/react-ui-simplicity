import {AbstractProvider} from "../shared/AbstractProvider";
import List from "./List";
import {ListNode} from "./ListNode";
import TextTool from "../shared/TextTool";

export class ListProvider extends AbstractProvider<List.Attributes, TextTool.Attributes, typeof ListNode> {

    title: string = "List"
    icon: string = "list"

    component = List

    tool = TextTool

    get factory(): typeof ListNode {
        return ListNode
    }

}