import { NextResponse } from 'next/server';

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login'
const privatePages = [
    { path: '/myreservations', role: 'reader' },
    { path: '/users', role: 'librarian' },
    { path: '/reservations', role: 'librarian' },
    { path: '/loans', role: 'librarian' },
]

export async function middleware(request) {
    const path = request.nextUrl.pathname
    const privatePage = privatePages.find((page) => page.path === path)
    const token = request.cookies.get('token')?.value

    if (!token && path === '/login') {
        return NextResponse.next()
    }

    if (!token && path !== '/login') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED
        return NextResponse.redirect(redirectUrl)
    }

    if (token && path === '/login') {
        return NextResponse.next()
    }

    if (token && path === '/') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/booklist'
        return NextResponse.redirect(redirectUrl)
    }

    if (token && path !== '/login') {
        try {
            const res = await fetch("http://localhost:3001/verifytoken", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            NextResponse.next();

        } catch (error) {
            console.log(error);
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
