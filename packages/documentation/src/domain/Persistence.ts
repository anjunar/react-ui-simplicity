import {registerEntity} from "react-ui-simplicity";
import User from "./control/User";
import Address from "./control/Address";
import Email from "./control/Email";
import Material from "./control/Material";

export function init() {

    registerEntity(User)
    registerEntity(Address)
    registerEntity(Email)
    registerEntity(Material)

}