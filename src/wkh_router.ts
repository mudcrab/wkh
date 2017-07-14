import * as Koa from "koa";
import * as Router from 'koa-router';

export type KoaRouterCallback = ( ctx:Koa.Context, next:((_?: object) => void) ) => any;

export class WkhRouter
{
	router:Router;
	[key: string]: any;

	constructor()
	{
		this.router = new Router();
	}

	get( path:string, fn:KoaRouterCallback )
	{
		this.router.get(path, fn);
	}
	
	post( path:string, fn:KoaRouterCallback )
	{
		this.router.post(path, fn);
	}

	put( path:string, fn:KoaRouterCallback )
	{
		this.router.put(path, fn);
	}

	patch( path:string, fn:KoaRouterCallback )
	{
		this.router.patch(path, fn);
	}

	del( path:string, fn:KoaRouterCallback )
	{
		this.router.del(path, fn);
	}

	options( path:string, fn:KoaRouterCallback )
	{
		this.router.options(path, fn);
	}

	head( path:string, fn:KoaRouterCallback )
	{
		this.router.head(path, fn);
	}

	setMiddleware( koa:Koa )
	{
		return koa.use( this.router.routes() ).use( this.router.allowedMethods() );
	}
}
