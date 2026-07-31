import Navbar from "@/layout/Navbar";
import Footer from "@/layout/Footer";
import { cn } from "@/lib/utils";

type PageLayoutProps = Readonly<{
    children: React.ReactNode;
    variant?: "default" | "auth" | "app";
    authLink?: "login" | "register";
    mainClassName?: string;
}>;

export default function PageLayout({
    children,
    variant = "default",
    authLink,
    mainClassName,
}: PageLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col">
            <Navbar variant={variant} authLink={authLink} />
            <main className={cn("flex-1", mainClassName)}>{children}</main>
            <Footer />
        </div>
    );
}
