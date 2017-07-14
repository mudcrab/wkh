import { Wkh } from './wkh';
import { WkhResource, WkhFunctionResource } from './wkh_resource';



class Test extends WkhResource
{
	constructor()
	{
		super();
	}
	kek()
	{
		return new Promise((resolve) => {
			resolve({ a: true })
		})
	}

	static prefix()
	{
		return '';
	}

	static routes( prefix:string ): WkhFunctionResource[]
	{
		return [
			{
				type: 'get',
				method: 'kek',
				path: '/kek'
			}
		];
	}
}

(new Wkh({}))
	.mountRoutes([ Test, { type: 'get', fn: () => {
		return new Promise((r) => { r({ top: 'top'})});
	}, path: '/top' } ])
	.run(3000, () => { console.log('running')});


export { Wkh };
