import {AbstractProvider} from "../shared/AbstractProvider";
import TableProcessor from "./TableProcessor";
import {TableCommand} from "./TableCommand";
import TableTool from "./TableTool";

export class TableProvider extends AbstractProvider<typeof TableCommand, TableProcessor.Attributes, TableTool.Attributes> {

    title = "Table";
    type = "table";
    command = TableCommand;
    icon = "table";
    processor = TableProcessor;
    tool = TableTool;

}