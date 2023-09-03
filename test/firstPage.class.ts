import { log, onClass } from "../src/typeDeco";
import { GetMapping } from "../src/routeMapping.decorator";

@onClass
export default class FirstPage {

	@GetMapping("/first")
	public index(req: any, res: any) {
		log("FirstPage index running");
		res.send("FirstPage index running");
	}
}
