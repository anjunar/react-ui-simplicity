import {AbstractProvider} from "../AbstractProvider";
import List from "./List";
import {ListNode} from "./ListNode";
import ListTool from "./ListTool";

export class ListProvider extends AbstractProvider<List.Attributes, ListTool.Attributes, typeof ListNode> {

    title: string = "List"
    icon: string = "list"

    component = List

    tool = ListTool

    get factory(): typeof ListNode {
        return ListNode
    }

}