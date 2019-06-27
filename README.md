## json-highlight
json high light plugin



### 安装

(highlight被占用)

`npm i json-stringfy`



### 使用

```javascript
//  jsonHeightLight(json[, options])

import jsonHeightLight from 'json-stringfy'

// 或者使用构建好的
import jsonHeightLight from 'json-highlight/dist/index.js'
import 'json-stringfy/dist/index.css'

const json = '{"test_one":"value","test_two":{"subkey_one":"value","subkey_two":"value"}}'
document.querySelector("pre").innerHTML = jsonHeightLight(json)  //需要将结果放到pre标签中


```

### options


#### colorConfig: Object

可以对配置颜色风格

```javascript
jsonHeightLight(json, {
  colorConfig: {
		string: '#9C5903',
		number: '#07BD1D',
		boolean: '#04228A',
		null: '#767573',
		key: '#088EDF',
		errorKey: '#f5222d',
		warningKey: '#9c5903',
	}
})
```

#### errorInfo:Array

可以对指定的key进行标识

```javascript
jsonHeightLight(json, {
  errorInfo: [
    {path: 'test_one', type: 'error'},
    {path: 'test_two.subkey_one', type: 'warning'}
  ]
})
```

效果：
![alt](<https://raw.githubusercontent.com/okmengzhilin/json-highlight/master/123123.png>)