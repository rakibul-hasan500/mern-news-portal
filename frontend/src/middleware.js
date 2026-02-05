import {NextResponse} from "next/server";
import {jwtVerify} from "jose";

export async function middleware(req){

    // Get Path Name
    const pathname = req.nextUrl.pathname

    // Get Token From Cookie
    const accessToken = req.cookies.get("accessToken")?.value

    // Decode
    let decoded = null
    if(accessToken){
        try{
            const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)
            const result = await jwtVerify(accessToken, secret)
            decoded = result?.payload
        }catch(err){
            console.error(err)
            decoded = null
        }
    }

    // Condition -- Loged In
    if(accessToken){

        // ADMIN - EDITOR - WRITER - USER
        if(["/forgot-password", "/login", "/reset-password", "/signup", "/verify-otp",].includes(pathname)){
            return NextResponse.redirect(new URL("/", req.url))
        }

        // ADMIN - EDITOR - WRITER
        if(!["admin", "editor", "writer"].includes(decoded?.role) && pathname === "/dashboard"){
            return NextResponse.redirect(new URL("/not-found", req.url))
        }

    }

    // Condition -- Loged Out
    if(!accessToken){

        // Edit Profile
        if(["/edit-profile"].includes(pathname)){
            return NextResponse.redirect(new URL("/login", req.url))
        }

        // Dashboard
        if(["/dashboard"].includes(pathname)){
            return NextResponse.redirect(new URL("/not-found", req.url))
        }

    }


    return NextResponse.next()
}


export const config = {
    matcher: [
        // Auth
        "/forgot-password",
        "/login",
        "/reset-password",
        "/signup",
        "/verify-otp",

        // User
        "/edit-profile",

        // Admin
        "/dashboard"
    ],
}