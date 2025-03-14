import ListProcessor from "./ListProcessor";
import {AbstractProvider} from "../shared/AbstractProvider";
import {ListCommand} from "./ListCommand";
import ListTool from "./ListTool";

export class ListProvider extends AbstractProvider<typeof ListCommand, ListProcessor.Attributes, ListTool.Attributes> {

    type : string = "list"

    icon = "list"

    title = "List"

    command = ListCommand

    processor = ListProcessor

    tool = ListTool

}