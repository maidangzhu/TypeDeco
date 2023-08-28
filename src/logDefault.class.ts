import { bean } from "../src/typeDeco";
import LogFactory from "./logFactory.class";

export default class LogDefault extends LogFactory {

	@bean
	createLog(): LogFactory {
		return new LogDefault();
	}

	public log(message?: any, ...optionalParams: any[]): void {
		console.log("console.log : " + message);
	}

}
