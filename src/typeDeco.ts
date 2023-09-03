import "reflect-metadata";
import * as walkSync from "walk-sync";
import BeanFactory from "./beanFactory.class";
import LogFactory from "./factory/logFactory.class";

/**
 * 这个装饰器应用在一个类上，它会获取当前的工作目录和 ts 文件列表，遍历并异步导入这些文件。
 * 然后实例化被装饰的类并尝试调用该类实例的 main 方法。
 * 注意，这个装饰器立即执行了一个自调用的异步函数。
 * @param constructor
 */
function app<T extends { new(...args: any[]): {} }>(constructor: T) {
	const srcDir = process.cwd() + "/src";
	const srcFiles = walkSync(srcDir, {globs: ['**/*.ts']});

	const testDir = process.cwd() + "/test";
	const testFiles = walkSync(testDir, {globs: ['**/*.ts']});

	(async function () {
		try {
			for (let p of srcFiles) {
				let moduleName = p.replace(".d.ts", "").replace(".ts", "");
				await import(srcDir + "/" + moduleName);
			}

			for (let p of testFiles) {
				let moduleName = p.replace(".d.ts", "").replace(".ts", "");
				await import(testDir + "/" + moduleName);
			}
		} catch (err) {
			console.error(err);
		}
		log("main start")
		const main = new constructor();
		main["main"]();
	}());
}

/**
 * 这个装饰器将被装饰的类方式 BeanFactory 中
 * @param constructor
 */
function onClass<T extends { new(...args: any[]): {} }>(constructor: T) {
	log("decorator onClass: " + constructor.name);
	BeanFactory.putBean(constructor, new constructor());
}

/**
 * 这个装饰器用于类的方法之上。它收集方法的返回类型元数据，并将该方法放入 BeanFactory，以返回类型的名字作为key。
 * @param target
 * @param propertyName
 * @param descriptor
 */
function bean(target: any, propertyName: string, descriptor: PropertyDescriptor) {
	let returnType = Reflect.getMetadata("design:returntype", target, propertyName);
	log("decorator bean, the return Type is: " + returnType.name);
	BeanFactory.putBean(returnType, target[propertyName]);
}

/**
 * 这个装饰器应用于类的某个属性，它会挂载一个getter在此属性上。
 * 此getter在被调用时，能够从 BeanFactory 中获取并返回该类型的 Bean。
 * @param target
 * @param propertyName
 */
function autoware(target: any, propertyName: string): void {
	let type = Reflect.getMetadata("design:type", target, propertyName);
	// 更改某个属性的 getter 方法，返回一个从 BeanFactory 中拿到的对象
	Object.defineProperty(target, propertyName, {
		get: function myProperty() {
			const beanObject = BeanFactory.getBean(type);
			return beanObject()
		}
	});
}

/**
 * 这个装饰器在定义时会打印一条消息，但在真正使用时，它会收集属性的类型元数据，并提供一个总是返回特定字符串的 getter。
 */
function inject(): any {
	return (target: any, propertyKey: string) => {
		console.log("decorator inject, in the return, propertyKey: " + propertyKey);
		let type = Reflect.getMetadata("design:type", target, propertyKey);
		console.log("decorator inject, in the return, type.name: " + type.name);
		return {
			get: function () {
				return "decorator inject, in the return get function";
			}
		};
	}
}

function log(message?: any, ...optionalParams: any[]) {
	const logBean = BeanFactory.getBean(LogFactory);
	if (logBean) {
		const logObject = logBean();
		logObject.log(message, ...optionalParams);
	} else {
		console.log(message, ...optionalParams);
	}
}

/**
 * 这个装饰器接受类和类的方法名作为参数，其目的是使得每次原方法被调用前都会先执行一个固定的方法。
 * 它把修改后的方法放回 BeanFactory。
 * @param constructorFunction
 * @param methodName
 */
function before(constructorFunction, methodName: string) {
	const targetBean = BeanFactory.getBean(constructorFunction);

	return function (
		target,
		propertyKey: string
	) {
		const currentMethod = targetBean[methodName];
		targetBean[methodName] = (...args) => {
			target[propertyKey]();
			log("eeeeeeee")
			return currentMethod(...args);
		}
		BeanFactory.putBean(constructorFunction, targetBean);
	};
}


export { onClass, bean, autoware, inject, log, app, before };
