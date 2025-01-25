import {AbstractEntity, Basic, Entity} from "react-ui-simplicity";

@Entity("Email")
export default class Email extends AbstractEntity {

    $type : "Email"

    @Basic()
    email : string

}