
import {isJson, formatErrorKey, getKeysPath, getJsonPathValueByPath} from './utils'
import './index.css'

export default (json='', options = {})=>{
	let jsonObj = isJson(json)

	let {
		errorInfo = [],
		colorConfig = {},
		pathTrigger = false,
		onClickKey = ()=>{}
	} = options

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

		if(pathTrigger === 'drag'){
			document.addEventListener('dragstart',function(e){
				if(e.target.className.indexOf('json-stringify')>=0&&e.target.className.indexOf('key')>=0){
					let path = e.target.dataset['path']
					e.dataTransfer.setData("path", path)
				}
			},false)
		}
		if(pathTrigger === 'click'){
			document.addEventListener('click',function(e){
				if(e.target.className.indexOf('json-stringify')>=0&&e.target.className.indexOf('key')>=0){
					let path = e.target.dataset['path']
					onClickKey(path)
				}
			},false)
		}

		jsonObj = formatErrorKey(jsonObj, errorInfo)
		jsonObj = getKeysPath(jsonObj)
		json = JSON.stringify(jsonObj,null,4)

		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

		return `<div class="json-container">${json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			let keyType = 'number'
			let keyPath = ''
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					keyType = 'key'
					match = match.replace(/_key_(error|warning|info){1}/, (errorType) => {
						keyType = `${keyType} ${errorType.replace(/_key_/g,'')}Key`
						return ''
					})
					match = match.replace(/\|path\(\S+\)/, (path) => {
						keyPath = path.replace(/\|path\(/g,'').replace(/\)/g,'')
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
			return `<span class="json-stringify ${keyType}" data-path="${keyPath}" draggable=${keyType.indexOf('key')>=0?(pathTrigger==='drag'):false} style="color: ${colorMap[colorKey]}">${match}</span>`;
		})}</div>`
	}else{
		return `<div class="json-container">${json}</div>`
	}
}

export const getValueByJsonPath = (path,json) => getJsonPathValueByPath(path,json)