import Hls from 'hls.js/dist/hls.min.js';
import type {
	LoaderContext,
	LoaderConfiguration
} from "hls.js";

import { fetch } from '@tauri-apps/plugin-http';


// Below code use a lot of any for types.
// I know this is bad but I can't find a proper type for hls.js because most document I found are in javascript.
// `this.readystatechange()` doesn't exist when I log it out but somehow callable. I don't know why.
// I got this implementation from `https://codepen.io/robwalch/pen/GRbOpaJ`
// If someone find a proper type for hls.js please let me know in pr.

const BaseLoader = Hls.DefaultConfig.loader as any;
class MODIFY_FLOADER extends BaseLoader {
	config!: LoaderConfiguration;
	context!: LoaderContext;
	loader!: {
		readyState: number,
		status: number,
		statusText: string,
		responseType: string,
		response: ArrayBuffer | null,
		responseText: ArrayBuffer | string | null,
		responseURL: string,
	};

	loadInternal() {
		const { config, context } = this;
		if (!config || !context) {
			return;
		}
		const url = context.url;
		
		fetch(url)
			.then(response => response.arrayBuffer())
			.then((responseData) => {
				this.loader = {
					readyState: 4,
					status: 200,
					statusText: '',
					responseType: context.responseType,
					response: responseData,
					responseText: responseData,
					responseURL: url,
				};
				this.readystatechange();
			}).catch((error) => {
				console.error(error);
				this.loader = {
					readyState: 0,
					status: 500,
					statusText: '',
					responseType: context.responseType,
					response: null,
					responseText: null,
					responseURL: url,
				};
				this.readystatechange();
			});
		
	}
}

export default MODIFY_FLOADER as any;