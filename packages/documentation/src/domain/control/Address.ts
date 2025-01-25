import {Basic, Entity} from "react-ui-simplicity";

@Entity("Address")
export default class Address {

    $type = "Address"

    @Basic()
    street : string

    @Basic()
    number : string

    @Basic()
    city : string

    @Basic()
    country : string

}