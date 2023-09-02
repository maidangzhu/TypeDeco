import { before, log, onClass } from "../src/typeDeco";
import FirstPage from "./firstPage.class";

@onClass
export default class AopTest {
	@before(FirstPage, "index")
	public FirstIndex() {
		log("Before FirstPage index run, at AopTest FirstIndex.");
		return "FirstIndex";
	}
}
