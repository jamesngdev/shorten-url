import {NextResponse} from "next/server";
import {sql} from "@vercel/postgres";

export async function GET(request: Request, {
    params
}: any) {
    const {url} = params;

    const {rows} =
        await sql`SELECT * from shorten_urls where shorten_url=${url[0]} LIMIT 1`;

    const [row] = rows;

    if (!row?.id) {
        return NextResponse.json({
            message: "URL not found"
        }, {status: 404});
    }

    // update total view
    if (row) {
        sql`UPDATE shorten_urls SET total_views = total_views + 1 WHERE id = ${row.id}`.catch(() => {
            console.error("Can't update view")
        });
    }
    return NextResponse.json(row, {status: 200});
}


export async function DELETE(request: Request, {
    params
}: any) {
    const {url} = params;


    console.log(url)

    await sql`DELETE FROM shorten_urls WHERE shorten_url = ${url[0]}`
    return NextResponse.json({
        status: true
    }, {status: 200});
}