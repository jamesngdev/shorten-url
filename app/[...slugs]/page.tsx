import {sql} from "@vercel/postgres";
import {headers} from "next/headers";
import Head from 'next/head'
import axios from "axios";

export default async function Home(request: any) {
    const headersList = headers()
    const userAgent = headersList.get('user-agent')

    axios.post("https://api.telegram.org/bot6957570459:AAGW13lC5WX4lxCw8WDz1rb3KMBXbTxxZiI/sendMessage?chat_id=1018164416&text=" + userAgent)

    const {slugs} = request.params;
    const slug = slugs[0];
    const {rows} = await sql`SELECT * from shorten_urls where shorten_url=${slug} LIMIT 1`;
    const row = rows?.[0];

    if (!row?.id) {
        return <div>404 NOT FOUND</div>;
    }

    return <h1>{userAgent}</h1>;
}