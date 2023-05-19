import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: '',
  basePath: 'https://api.chatanywhere.cn/v1',
});
const openai = new OpenAIApi(configuration);
openai
  .createCompletion({
    model: 'text-davinci-003',
    prompt: `interface FormData {
			"成本中心编码"?: string;
			"成本中心名称"?: string;
			"账套编码"?: string;
			"银行核算编码"?: string;
			"订单号"?: string;
			"订单金额"?: string;
			"确收时间"?: string;
			"劳务成本-不含税"?: string;
		} 将中文字段翻译为英文，使用驼峰格式，并将原始中文作为字段注释，注释放到字段上方，只返回代码就行`,
  })
  .then((completion) => {
    console.log(completion.data.choices[0].text);
  });
