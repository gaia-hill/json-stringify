
import {isJson, formatErrorKey} from './utils'
import './index.css'

export default (json='', options = {})=>{
	let jsonObj = isJson(json)

	let {errorInfo = [],colorConfig = {}} = options

	//  默认颜色配置
	const colorMap = Object.assign({
		string: '#9C5903',
		number: '#07BD1D',
		boolean: '#04228A',
		null: '#767573',
		key: '#088EDF',
		errorKey: '#f5222d',
		warningKey: '#9c5903',
	}, colorConfig)

	if(jsonObj && json !== ''){

		jsonObj = formatErrorKey(jsonObj, errorInfo)
		json = JSON.stringify(jsonObj,null,4)

		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

		return `<div class="json-container">${json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			let keyType = 'number'
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					keyType = 'key'
					match = match.replace(/_key_(error|warning|info){1}/, (errorType) => {
						keyType = `${keyType} ${errorType.replace(/_key_/g,'')}Key`
						return ''
					})
				} else {
					keyType = 'string'
				}
			} else if (/true|false/.test(match)) {
				keyType = 'boolean'
			} else if (/null/.test(match)) {
				keyType = 'null'
			}

			let colorKey = /(error|warning|info){1}/.test(keyType)?keyType.replace('key ',''):keyType
			return `<span class="${keyType}" style="color: ${colorMap[colorKey]}">${match}</span>`;
		})}</div>`
	}else{
		return `<div class="json-container">${json}</div>`
	}

}