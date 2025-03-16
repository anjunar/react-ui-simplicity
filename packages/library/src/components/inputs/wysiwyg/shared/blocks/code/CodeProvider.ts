import {AbstractProvider} from "../shared/AbstractProvider";
import {CodeCommand} from "./CodeCommand";
import CodeProcessor from "./CodeProcessor";
import CodeTool from "./CodeTool";

export class CodeProvider extends AbstractProvider<typeof CodeCommand, CodeProcessor.Attributes, CodeTool.Attributes> {

    command = CodeCommand

    icon = "code"

    processor = CodeProcessor

    title = "Code"

    tool = CodeTool

    type = "code"



}