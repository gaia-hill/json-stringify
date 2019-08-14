

export const isJson = (json) => {
	try {
		if(typeof json === 'string'){
			let _tempVal = JSON.parse(json)
			if (typeof _tempVal === 'object') {
				return _tempVal
			} else {
				return false
			}
		}else{
			if (typeof json === 'object' && json === null) {
				return json
			}else{
				return false
			}
		}
	} catch (e) {
		return false;
	}
}

const replaceFilter = (props)=>{
	let filterArr = []
	let filterIndex = 0
	while(props.includes(`[`)&&props.includes(`]`)){
		let startIndex = props.indexOf("[")+1
		let endIndex = props.indexOf(`]`)
		let filter = props.substring(startIndex, endIndex)
		props = props.replace(`[${filter}]`, `!(${filterIndex})`)
		filter = filter.replace(/"/g,"'")
		filter = filter.replace(/(=')/, '==\'')
		filter = filter.replace(/=/, '==')
		filterArr.push(filter)
		filterIndex++
	}
	return {props, filterArr}
}

export const getJsonPathValueByPath = (path,json) => {
	json = isJson(json)
	let pathTemp = replaceFilter(path.replace(/^root/,''))
	let propsArr = pathTemp.props.split('.').filter(prop=>prop)

	window.result = undefined
	if(path){
		let evalString = `
			let obj = ${JSON.stringify(json)}
			result = obj
		`
		propsArr.forEach((item) => {
			let itemTemp = item
			item = item.replace(/(!\(\d+\))/g, '')
			let filter = itemTemp.match(/(!\(\d+\))/g)
			if(filter){
				filter = filter.map((index) => {
					return parseInt(index.replace("!(","").replace(")",""))
				})
			}else{
				filter = []
			}

			evalString = `${evalString}.${item}`
			if(filter.length>0){
				filter.forEach((filter_item) => {
					let type = parseInt(pathTemp.filterArr[filter_item])
					if(!isNaN(type)){
						evalString = `${evalString}[${parseInt(pathTemp.filterArr[filter_item])}]`
					}else{
						evalString = `${evalString}.filter(function(val,index){return val.${pathTemp.filterArr[filter_item]}})`
					}
				})
			}
		})
		try {
			eval(evalString)
		} catch (error) {
			window.result = undefined
		}
	}


	return window.result
}

export const formatErrorKey = (obj, errorInfo) => {

	const getJsonPathValue = (info,currentObj) => {
		let path = info.path
		let errorType = info.type
		let propsArr = path.replace(/^root/,'').split('.').filter(prop=>prop)
		let lastKey = propsArr.pop()
		let findPath = propsArr.join('.')?`.${propsArr.join('.')}`:''
		window.formatObj = obj
		let evalString = `
			let currentObj = ${JSON.stringify(currentObj)};
			let lastKey = '${lastKey}';
			let result = ${getJsonPathValueByPath(path,currentObj)===undefined}
			if(result && lastKey.indexOf('[')<0){
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
			// console.log(error)
		}
		return window.formatObj
	}

	errorInfo.forEach((info) => {
		obj = getJsonPathValue(info, obj)
	})

	return obj
}

export const getKeysPath = (obj, currentPath='root') => {
	let objKeys = Object.getOwnPropertyNames(obj)
	let isArray = (obj instanceof Array)
	let currentObj = isArray?[]:{}
	objKeys.forEach(originKey=>{
		let key = originKey.replace(/_key_(error|warning|info){1}/,'')
		let nextKey = ''
		let path = ''
		if(isArray){
			path = `${currentPath}[${key}]`
			nextKey = originKey
		}else{
			path = `${currentPath}.${key}`
			nextKey = `${originKey}|path(${path})`
		}
		currentObj[nextKey] = obj[originKey]
		if(currentObj[nextKey] && typeof(currentObj[nextKey])==='object'){
			currentObj[nextKey] = getKeysPath(obj[originKey],path)
		}
	})
	return currentObj
}