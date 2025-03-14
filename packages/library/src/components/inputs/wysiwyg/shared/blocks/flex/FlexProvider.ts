import {AbstractProvider} from "../shared/AbstractProvider";
import {FlexCommand} from "./FlexCommand";
import FlexProcessor from "./FlexProcessor";
import FlexTool from "./FlexTool";

export class FlexProvider extends AbstractProvider<typeof FlexCommand, FlexProcessor.Attributes, FlexTool.Attributes> {

    command: typeof FlexCommand = FlexCommand

    icon: string = "flex_wrap"

    processor = FlexProcessor

    title: string = "Flex Box"

    tool = FlexTool

    type: string = "flex"


}