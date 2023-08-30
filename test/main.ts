import ServerFactory from "../src/factory/serverFactory.class";
import { app, log, autoware } from "../src/typeDeco";

@app
class Main {
	@autoware
	public server: ServerFactory;

	public main() {
		this.server.start(8080);
		log('start application');
	}
}
