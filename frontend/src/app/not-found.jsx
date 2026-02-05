import "./globals.css"
import "../css/font.css"
import Link from "next/link";

export default function NotFound(){
    return (
        <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
            {/* Soft background blobs */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-purple-200 blur-3xl opacity-70"/>
            <div className="pointer-events-none absolute top-10 -right-40 h-[520px] w-[520px] rounded-full bg-pink-200 blur-3xl opacity-70"/>
            <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full bg-cyan-200 blur-3xl opacity-70"/>

            {/* Subtle grid */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20"/>

            {/* Content */}
            <div className="relative flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-xl backdrop-blur-xl md:p-12">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        404 Error • Page Not Found
                    </div>

                    {/* Status Code */}
                    <h1 className="mt-6 text-7xl font-extrabold tracking-tight md:text-9xl">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">404</span>
                    </h1>

                    {/*  Title  */}
                    <h2 className="mt-4 text-2xl font-bold md:text-4xl">Oops! This page doesn’t exist 😅</h2>

                    {/*  Desc  */}
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">The page you’re looking for might have been moved, deleted, or the URL may be incorrect. Please check the address or go back home.</p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        {/*  Home  */}
                        <Link href="/" className="group inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:scale-[1.02] active:scale-[0.98]">
                            Go Back Home
                            <span className="ml-2 transition group-hover:translate-x-1">→</span>
                        </Link>

                        {/*  Blog  */}
                        <Link href="/blog" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50">Visit Blog</Link>
                    </div>

                    {/* Mini tip */}
                    <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm text-slate-600">🔎 Tip: Try searching from the menu or double-check the URL.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

