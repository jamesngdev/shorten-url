import {NextResponse} from "next/server";
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const data = await request.json();
    const {username, password} = data;
    if (!username || !password || username !== "jamesngdev" || password !== "Admin@123") {
        return NextResponse.json({
            error: true,
        }, {status: 301});
    }

    cookies().set('isLogin', 'true', {
        maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({
        message: "Login success"
    }, {status: 200});
}

export async function DELETE() {
    cookies().set('isLogin', '', {
        maxAge: 0,
    })

    return NextResponse.json({
        message: "Logout success"
    }, {status: 200});
}

export async function GET() {
    const isLogin = cookies().get('isLogin');
    if (isLogin) {
        return NextResponse.json({
            isLogin: true,
            message: "You are login"
        }, {status: 200});
    }

    return NextResponse.json({
        isLogin: false,
        message: "You are not login"
    }, {status: 200});
}