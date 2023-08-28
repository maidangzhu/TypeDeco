import { onClass, log } from "../src/typeDeco";

@onClass
export default class TestLog {

    constructor() {
        log("TestLog constructor");
    }
}
