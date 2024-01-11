import  { NextResponse, type NextRequest } from 'next/server'
import { env } from './env.mjs'


export function middleware(req: NextRequest){
    const xSecret = req.headers.get('x-secret');
    const internalApiKey = env.INTERNAL_API_KEY;

    console.log({ xSecret, internalApiKey })
    const response = NextResponse.next()
    if(xSecret !== internalApiKey ){
        return Response.json(
            { success: false, message: 'authentication failed' },
            { status: 401 }
          )

    }

    return response;
}

export const config = {
    matcher: ['/api/presigned-url', '/api/${repo}/${key}']
}