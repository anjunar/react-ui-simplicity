import {AbstractProvider} from "../AbstractProvider";
import List from "./List";
import {ListNode} from "./ListNode";

export class ListProvider extends AbstractProvider<List.Attributes, typeof ListNode> {

    title: string = "List"
    icon: string = "list"

    component = List

    get factory(): typeof ListNode {
        return ListNode
    }

}