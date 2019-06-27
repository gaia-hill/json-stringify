

export const isJson = (json) => {
	try {
		let _tempVal = JSON.parse(json)
		if (typeof _tempVal === 'object') {
			return JSON.parse(json)
		} else {
			return false
		}
	} catch (e) {
		return false;
	}
}

export const formatErrorKey = (obj, errorInfo) => {

	const getJsonPathValue = (info,currentObj) => {
		let path = info.path
		let errorType = info.type
		let propsArr = path.split('.')
		let lastKey = propsArr.pop()
		let findPath = propsArr.join('.')?`.${propsArr.join('.')}`:''
		window.formatObj = obj
		let evalString = `
			let currentObj = ${JSON.stringify(currentObj)};
			let lastKey = '${lastKey}';
			let result = currentObj.${path};
			if(result!==undefined && lastKey.indexOf('[')<0){
				let errorType = '${errorType}';
				let keys = Object.keys(currentObj${findPath});
				let values = Object.values(currentObj${findPath});
				let index = keys.indexOf('${lastKey}');
				if(index>=0){
					keys[index] = '${lastKey}_key_${errorType}';
				}

				currentObj${findPath} = {};
				keys.forEach(function(key, key_index){
					currentObj${findPath}[key] = values[key_index];
				})
			}
			formatObj = currentObj;
		`
		try {
			eval(evalString)
		} catch (error) {
			console.log(error)
		}
		return window.formatObj
	}

	errorInfo.forEach((info) => {
		obj = getJsonPathValue(info, obj)
	})

	return obj
}