import {NextResponse} from "next/server";
import {sql} from "@vercel/postgres";

export async function GET(request: Request) {
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
    const data = await request.json();
    console.log(data)
    const {rows} = await sql`INSERT INTO public.shorten_urls (id, title, description, image, shorten_url, url, comment, total_views) VALUES (DEFAULT, ${data.title}, ${data.description}, ${data.image}, ${data.shorten_url}, ${data.url}, ${data.comment}, 0);`
    return NextResponse.json(rows, {status: 200});
}
