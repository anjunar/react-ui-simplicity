import ListProcessor from "./ListProcessor";
import {AbstractProvider} from "../shared/AbstractProvider";
import {ListCommand} from "./ListCommand";

export class ListProvider extends AbstractProvider<typeof ListCommand, ListProcessor.Attributes> {

    type : string = "list"

    icon = "list"

    title = "List"

    command = ListCommand

    processor = ListProcessor

}