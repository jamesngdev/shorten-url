import {sql} from "@vercel/postgres";
import {headers} from "next/headers";

export default async function Home(request: any) {
    const headersList = headers()
    const userAgent = headersList.get('user-agent')
    console.log(userAgent)
    const {slugs} = request.params;
    const slug = slugs[0];
    const {rows} = await sql`SELECT * from shorten_urls where shorten_url=${slug} LIMIT 1`;
    const row = rows?.[0];

    if (!row?.id) {
        return <div>404 NOT FOUND</div>;
    }

    return <head>
        <title>{row.title}</title>
        <meta name="description" content={row.description}/>
        <meta property="og:title" content={row.title}/>
        <meta property="og:description"
              content={row.description}/>
        <meta property="og:image" content={row.image}/>
    </head>
}