import {cookies} from "next/headers";

export const isLogin = () => {
    return cookies().get('isLogin');
}