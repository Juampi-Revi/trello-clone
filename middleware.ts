import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
  afterAuth(auth, req) {
    //Si el usuario esta conectado y la ruta es publica
    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org";
      //Si el usuario ya tiene una organizacion creada
      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }
      //segun el caso llama a una ruta o a la otra
      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }
    //Si el usuario no esta conectado o la ruta no es publica, lo manda a la ruta publica
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    //Si el usuario esta conectado pero no tiene una organizacion lo obliga a ir a crearla
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
