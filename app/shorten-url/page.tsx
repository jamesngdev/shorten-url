import ShortenURL from "@/app/shorten-url/ui";
import {isLogin} from "@/app/libs/helpers/auth";
import {redirect} from "next/navigation";

export default async function ShortPage() {
    if (!isLogin()) {
        return redirect('/auth')
    }

    return <ShortenURL/>
}