import syntaxHighlight, {getValueByJsonPath} from './index.js'

let json = '{"cate_id":"10","cate_type":"cate","cate_code":"click","cate_name":"点击","filter":[{"dim":"evt_id1","dim_cate":"service_property","rel":"equal","val":[{"code":"20892","name":"20892"},{"code":"456456","name":"456456"}]},{"dim":"evt_id2","dim_cate":"service_property","rel":"equal","val":[{"code":"20892","name":"asddfg"}]}],"metric":["cnt"],"flag":0}'

document.addEventListener('dragover',function(e){
	e.preventDefault()
},false)

document.addEventListener('drop',function(e){
	e.preventDefault()
	let path = e.dataTransfer.getData("path")
	e.target.value = path
},false)


let html = syntaxHighlight(json,{
	errorInfo:[
		{path: 'root.filter[0].val[0].code', type: 'error'},
		{path: 'root.filter[0].val[0].name', type: 'warning'}
	],
	pathTrigger:'click',
	onClickKey:(path)=>{
		console.log(path)
	}
})

console.log(getValueByJsonPath('root.filter[dim="evt_id2"][0].val[0].name',json))

document.querySelector("#test").innerHTML = html


