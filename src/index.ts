/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import * as yaml from 'js-yaml';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = "https://s1.trojanflare.one/clashx/01641509-925f-4119-b758-0298991ac7f7";
		const init = {
		};
		const response = await fetch(url, init);
		const netConfig = await this.getNetConfig(response);
		const results = this.appendCustomRules(netConfig)

		return new Response(results, init);
	},


	/**
 * getNetConfig awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
	async getNetConfig(response: Response) {
		const { headers } = response;
		const contentType = headers.get("content-type") || "";
		if (contentType.includes("application/json")) {
			return JSON.stringify(await response.json());
		}
		return response.text();
	},
	/**
 * 
 * 增加自定义规则
 */
	appendCustomRules(netConfig: string) {
		// 将字符串转换为对象
		var config = yaml.load(netConfig) as any;
	
		config.rules = config.rules.filter((item: string) => !item.includes("microsoft"));

		// 添加自定义规则
		config.rules.push('DOMAIN-KEYWORD,microsoft,Proxy');
		config.rules.push('DOMAIN-KEYWORD,copilot,Proxy');
		config.rules.push('DOMAIN-SUFFIX,microsofttranslator.com,Proxy');
		// 将对象转换回字符串
		var updatedConfigString = yaml.dump(config);
		return updatedConfigString;
	}
};
