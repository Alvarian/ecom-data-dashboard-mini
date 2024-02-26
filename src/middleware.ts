import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
// Redirect to /signin if the user is not authenticated

// also include dynamic route /product/[id]
export default authMiddleware({
  publicRoutes: ["/api/uploadthing"],
});

// run all api routes through Clerk's authMiddleware
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};