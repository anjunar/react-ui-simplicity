import {registerEntity} from "react-ui-simplicity";
import User from "./control/User";
import Address from "./control/Address";
import Email from "./control/Email";

export function init() {

    registerEntity(User)
    registerEntity(Address)
    registerEntity(Email)

}