import * as Koa from "koa";
import * as body from 'koa-bodyparser';
import * as serve from 'koa-static';
import * as jwt from 'koa-jwt';
import { WkhRouter } from './wkh_router';
import { WkhResource, WkhFunctionResource } from './wkh_resource';

export interface WkhOptions {
	port?: number;
	staticDir?: string;
	jwt?: boolean;
};

export class Wkh
{
	koa:Koa;
	router:WkhRouter;
	port:Number;

	constructor( options:WkhOptions )
	{
		this.koa = new Koa();
		this.router = new WkhRouter();
		
		this.koa.use(body());
	}

	setStatic( dir:string )
	{
		this.koa.use( serve( dir ) );

		return this;
	}

	setJwt( secret:string, excludedPaths:string[] = [] )
	{
		this.koa.use(
			jwt({
				secret: secret
			})
			.unless({
				path: excludedPaths
			})
		);

		return this;
	}

	setMiddleware( fn:Koa.Middleware )
	{
		this.koa.use( fn );

		return this;
	}

	mountRoutes( routes:any )
	{
		Object.keys( routes ).forEach(className => {
			const Resource = routes[ className ];

			if ( typeof Resource.routes === 'function' )
			{
				this.mountClass( Resource as WkhResource )
			}
			else
			{
				this.mountFunction( Resource );
			}
		});

		return this;
	}

	private mountClass( Resource:any )
	{
		Resource.routes( Resource.prefix() ).forEach((route:WkhFunctionResource) => {
			const resource = new Resource();

			this.mountFunction( route, resource );
		});
	}

	private mountFunction( route:WkhFunctionResource, resource?:WkhResource )
	{
		const httpMethod:any = route.type || 'get';

		this.router[ route.type ](route.path, async( ctx:Koa.Context, next:((_?: object) => void) ) => {
			let args:any[] = Object.keys( ctx.params ).map(i => ctx.params[ i ]);

			if ( ctx.request.body )
				args.push( ctx.request.body );
			
			args.push( ctx );

			try
			{
				if ( typeof resource !== 'undefined' && route.method )
				{
					ctx.body = await resource[ route.method ].apply( resource, args );
				}
				else
				{
					route.fn = route.fn || (() => new Promise((resolve) => {}));
					ctx.body = await route.fn.apply( null, args );
				}
			}
			catch(e)
			{
				ctx.status = 500;
				ctx.body = {};
			}
		});
	}

	run( port?:Number, fn:any = () => {} )
	{
		this.router.setMiddleware( this.koa );

		this.koa.listen( port || this.port || 3000, fn );
	}
}
