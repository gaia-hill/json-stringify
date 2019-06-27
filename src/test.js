import syntaxHighlight from './index.js'

let json = '{"test_one":"value","test_two":{"subkey_one":"value","subkey_two":"value"}}'
// let json = '123123'
let html = syntaxHighlight(json,{
	errorInfo:[
		{path: 'test_one', type: 'error'},
		{path: 'test_two.subkey_one', type: 'warning'}
	 ]
})

document.querySelector("#test").innerHTML = html