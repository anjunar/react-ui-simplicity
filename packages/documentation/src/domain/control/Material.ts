import {ActiveObject, Basic, Entity} from "react-ui-simplicity";

@Entity("Material")
export default class Material extends ActiveObject {

    @Basic()
    position : number

    @Basic()
    name : string

    @Basic()
    weight : number

    @Basic()
    symbol : string

}