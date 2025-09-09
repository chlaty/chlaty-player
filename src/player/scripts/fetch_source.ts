import { fetch } from '@tauri-apps/plugin-http';


const fetch_source = async (
    source:string, 
    {
        host,origin,referer
    }:{
        host?:string,
        origin?:string,
        referer?:string
    }
): Promise<string> => {
        try {
            const headers:{
				"Host"?:string,
				"Origin"?:string,
				"Referer"?:string,
			} = {};

			if (host) {headers["Host"] = host};
			if (origin) {headers["Origin"] = origin};
			if (referer) {headers["Referer"] = referer};

            const response = await fetch(source,{headers});
            const text = await response.text();
            console.log(text);
            // Get MIME type from response headers
            const contentType = response.headers.get("Content-Type") || "application/x-mpegurl";

            const blob = new Blob([text], { type: contentType });
            const blobUrl = URL.createObjectURL(blob);

            return blobUrl
            
        } catch (error) {
            console.error(`Error loading source: `, error);
            throw new Error(`Error loading source: ${error}`);
        }
    
}

export default fetch_source;