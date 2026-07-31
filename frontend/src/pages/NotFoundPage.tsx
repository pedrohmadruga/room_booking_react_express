import { Link } from "react-router-dom";
import PageLayout from "@/layout/PageLayout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFoundPage() {
    return (
        <PageLayout
            variant="app"
            mainClassName="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center text-brand"
        >
            <p className="text-sm font-medium text-brand/60">404</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Page not found
            </h1>
            <p className="mt-3 max-w-md text-sm text-brand/80">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                to="/"
                className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-8 bg-brand px-6 text-white hover:bg-brand-hover",
                )}
            >
                Back to home
            </Link>
        </PageLayout>
    );
}
