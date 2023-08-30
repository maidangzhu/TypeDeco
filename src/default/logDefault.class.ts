import { bean } from "../typeDeco";
import LogFactory from "../factory/logFactory.class";

export default class LogDefault extends LogFactory {
	@bean
	createLog(): LogFactory {
		return new LogDefault();
	}

	public log(message?: any, ...optionalParams: any[]): void {
		console.log("console.log : " + message);
	}

}
