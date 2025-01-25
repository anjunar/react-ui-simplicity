import {registerEntity} from "react-ui-simplicity";
import User from "./control/User";
import Address from "./control/Address";

export function init() {

    registerEntity(User)
    registerEntity(Address)

}