import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': process.env.ADMIN_URL || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json(null, { headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const tag = request.nextUrl.searchParams.get('tag');

    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json(
            { message: 'Invalid secret' },
            { status: 401, headers: CORS_HEADERS },
        );
    }

    if (!tag) {
        return NextResponse.json(
            { message: 'Missing tag param' },
            { status: 400, headers: CORS_HEADERS },
        );
    }

    revalidateTag(tag, 'default');

    return NextResponse.json(
        { revalidated: true, now: Date.now() },
        { headers: CORS_HEADERS },
    );
}
