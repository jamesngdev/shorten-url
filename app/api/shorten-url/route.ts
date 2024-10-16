import {NextResponse} from "next/server";
import {sql} from "@vercel/postgres";
import {isLogin} from "@/app/libs/helpers/auth";

export async function GET(request: Request) {
    if (!isLogin()) {
        return NextResponse.json({
            error: true,
        }, {status: 301});
    }

    const {searchParams} = new URL(request.url);
    let query = searchParams.get("query") || "";

    if (!query) {
        const {rows} = await sql`SELECT * from shorten_urls ORDER BY id DESC`;
        return NextResponse.json(rows, {status: 200});
    }

    query = '%' + query + '%'
    const {rows} =
        await sql`SELECT * from shorten_urls WHERE title ILIKE ${query} OR description ILIKE ${query} OR url ILIKE ${query} OR shorten_url ILIKE ${query} OR comment ILIKE ${query} ORDER BY id DESC`;

    return NextResponse.json(rows, {status: 200});
}

export async function POST(request: Request) {
    if (!isLogin()) {
        return NextResponse.json({
            error: true,
        }, {status: 301});
    }

    const data = await request.json();
    const {rows} = await sql`INSERT INTO public.shorten_urls (id, title, description, image, shorten_url, url, comment, total_views, is_redirect) VALUES (DEFAULT, ${data.title}, ${data.description}, ${data.image}, ${data.shorten_url}, ${data.url}, ${data.comment},  0, ${data.is_redirect});`
    return NextResponse.json(rows, {status: 200});
}
