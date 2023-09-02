/**
 * 是一个简单的工厂实现，用来管理（如存储和重用）应用程序中的对象实例。
 * 这种模式在 Java Spring 框架中很常见，对其中的对象或者所谓的 "Beans" 进行管理。
 */
export default class BeanFactory {
	private static beanMapper: Map<string, any> = new Map<string, any>();
	private static beanFunctionMapper: Map<string, any> = new Map<string, any>();

	public static putBean(mappingClass: Function, beanClass: any): any {
		this.beanMapper.set(mappingClass.name, beanClass);
		console.log(this.beanMapper);
	}

	public static getBean(mappingClass: Function): any {
		return this.beanMapper.get(mappingClass.name);
	}

	public static getBeanFunction(mappingFunction: Function): Function {
		return this.beanFunctionMapper.get(mappingFunction.name);
	}

	public static putBeanFunction(mappingFunction: Function, beanFunction: Function): void {
		this.beanFunctionMapper.set(mappingFunction.name, beanFunction);
	}
}
