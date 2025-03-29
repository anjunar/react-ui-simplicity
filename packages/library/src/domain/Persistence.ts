import {registerConverter, registerEntity} from "../mapper/Registry";
import LinkObject from "./container/LinkObject";
import Media from "./components/input/image/Media";
import Editor from "./components/input/editor/EditorModel";
import TableObject from "./container/TableObject";
import RowObject from "./container/RowObject";
import Thumbnail from "./components/input/image/Thumbnail";
import DateConverter from "../mapper/converters/DateConverter";
import LocalDateTimeConverter from "../mapper/converters/LocalDateTimeConverter";
import LocalDateConverter from "../mapper/converters/LocalDateConverter";
import DurationConverter from "../mapper/converters/DurationConverter";
import NotBlankValidator from "./descriptors/validators/NotBlankValidator";
import SizeValidator from "./descriptors/validators/SizeValidator";
import NotNullValidator from "./descriptors/validators/NotNullValidator";
import EmailValidator from "./descriptors/validators/EmailValidator";
import PastValidator from "./descriptors/validators/PastValidator";
import LocalTimeConverter from "../mapper/converters/LocalTimeConverter";
import DayOfWeekConverter from "../mapper/converters/DayOfWeekConverter";
import {DayOfWeek, Duration, LocalDate, LocalDateTime, LocalTime} from "@js-joda/core";
import PatternValidator from "./descriptors/validators/PatternValidator";
import CollectionDescriptor from "./descriptors/CollectionDescriptor";
import EnumDescriptor from "./descriptors/EnumDescriptor";
import NodeDescriptor from "./descriptors/NodeDescriptor";
import ObjectDescriptor from "./descriptors/ObjectDescriptor";
import {AbstractContainerNode, AbstractNode, RootNode, TextNode} from "../components/inputs/wysiwyg/core/TreeNode";
import {CodeNode} from "../components/inputs/wysiwyg/blocks/code/CodeNode";
import {ImageNode} from "../components/inputs/wysiwyg/blocks/image/ImageNode";
import {ItemNode, ListNode} from "../components/inputs/wysiwyg/blocks/list/ListNode";
import {ParagraphNode} from "../components/inputs/wysiwyg/blocks/paragraph/ParagraphNode";
import {TableCellNode, TableNode, TableRowNode} from "../components/inputs/wysiwyg/blocks/table/TableNode";

export function init() {

    registerEntity(TableObject)
    registerEntity(RowObject)
    registerEntity(LinkObject)
    registerEntity(Media)
    registerEntity(Thumbnail)
    registerEntity(Editor)

    registerEntity(CollectionDescriptor)
    registerEntity(EnumDescriptor)
    registerEntity(NodeDescriptor)
    registerEntity(ObjectDescriptor)

    registerEntity(NotBlankValidator)
    registerEntity(NotNullValidator)
    registerEntity(SizeValidator)
    registerEntity(EmailValidator)
    registerEntity(PastValidator)
    registerEntity(PatternValidator)

    registerEntity(AbstractNode)
    registerEntity(AbstractContainerNode)
    registerEntity(RootNode)
    registerEntity(TextNode)
    registerEntity(CodeNode)
    registerEntity(ImageNode)
    registerEntity(ItemNode)
    registerEntity(ListNode)
    registerEntity(ParagraphNode)
    registerEntity(TableCellNode)
    registerEntity(TableRowNode)
    registerEntity(TableNode)

    registerConverter(Date, new DateConverter())
    registerConverter(LocalDateTime, new LocalDateTimeConverter())
    registerConverter(LocalDate, new LocalDateConverter())
    registerConverter(LocalTime, new LocalTimeConverter())
    registerConverter(Duration, new DurationConverter())
    registerConverter(DayOfWeek, new DayOfWeekConverter())


}