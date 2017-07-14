export class WkhResource
{
	// [key: string]: void|string|WkhFunctionResource[]|Promise<any>|Function;
	[key: string]: any;
	
	constructor()
	{
		
	}

	static prefix( prefix:string )
	{
		return prefix;
	}

	static routes( prefix:string ): WkhFunctionResource[]
	{
		return [];
	}
}

export interface WkhFunctionResource
{
	type: string;
	fn?: Function;
	method?: string;
	path: string;
};
