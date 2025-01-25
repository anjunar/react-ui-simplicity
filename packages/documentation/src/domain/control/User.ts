import {AbstractEntity, Basic, Entity} from "react-ui-simplicity";
import Address from "./Address";

@Entity("User")
export default class User extends AbstractEntity {

    $type = "User"

    @Basic()
    name: string

    @Basic()
    firstName: string

    @Basic()
    lastName: string

    @Basic()
    address : Address
}