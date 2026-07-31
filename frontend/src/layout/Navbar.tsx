import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SpaceHubLogo from "@/components/SpaceHubLogo";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
    { label: "Rooms", href: "#rooms" },
    { label: "How it works", href: "#how-it-works" },
    { label: "About us", href: "#about" },
    { label: "Contact us", href: "#contact" },
] as const;

type NavbarProps = Readonly<{
    variant?: "default" | "auth" | "app";
    authLink?: "login" | "register";
}>;

type AuthPromptProps = Readonly<{
    authLink: "login" | "register";
}>;

function AuthPrompt({ authLink }: AuthPromptProps) {
    if (authLink === "login") {
        return (
            <p className="max-w-[14rem] text-right text-sm text-brand sm:max-w-none">
                New here?{" "}
                <Link to="/register" className="font-medium text-blue-500 hover:text-brand-hover">
                    Register for free
                </Link>
            </p>
        );
    }

    return (
        <p className="max-w-[14rem] text-right text-sm text-brand sm:max-w-none">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-500 hover:text-brand-hover">
                Log in
            </Link>
        </p>
    );
}

type UserActionsProps = Readonly<{
    className?: string;
    onLogout: () => void;
}>;

function UserActions({ className, onLogout }: UserActionsProps) {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className={cn("ml-auto hidden min-w-0 items-center gap-3 md:flex", className)}>
            {isAuthenticated ? (
                <>
                    <span
                        className="max-w-[8rem] truncate text-sm text-brand lg:max-w-[10rem]"
                        title={user?.name}
                    >
                        Hi, {user?.name}
                    </span>
                    <Link
                        to="/bookings"
                        className="shrink-0 text-sm text-brand hover:text-blue-500"
                    >
                        My bookings
                    </Link>
                    <Button
                        type="button"
                        size="lg"
                        className="shrink-0 bg-brand px-6 text-white hover:bg-brand-hover"
                        onClick={onLogout}
                    >
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Link
                        to="/login"
                        className={cn(buttonVariants({ variant: "link" }), "text-brand")}
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "bg-brand px-6 text-white hover:bg-brand-hover",
                        )}
                    >
                        Sign up
                    </Link>
                </>
            )}
        </div>
    );
}

type MobileNavProps = Readonly<{
    showHomeLinks: boolean;
    onClose: () => void;
    onLogout: () => void;
}>;

function MobileNav({ showHomeLinks, onClose, onLogout }: MobileNavProps) {
    const { user, isAuthenticated } = useAuth();

    return (
        <div id="mobile-nav" className="border-t border-border bg-surface px-4 py-4 md:hidden">
            {showHomeLinks ? (
                <nav className="flex flex-col gap-1" aria-label="Mobile main">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand hover:bg-muted"
                            onClick={onClose}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            ) : null}

            <div
                className={cn(
                    "flex flex-col gap-2",
                    showHomeLinks && "mt-4 border-t border-border pt-4",
                )}
            >
                {isAuthenticated ? (
                    <>
                        <p className="truncate px-1 text-sm text-brand" title={user?.name}>
                            Hi, {user?.name}
                        </p>
                        <Link
                            to="/bookings"
                            onClick={onClose}
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "w-full border border-brand text-brand",
                            )}
                        >
                            My bookings
                        </Link>
                        <Button
                            type="button"
                            size="lg"
                            className="w-full bg-brand text-white hover:bg-brand-hover"
                            onClick={() => {
                                onClose();
                                onLogout();
                            }}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            onClick={onClose}
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "w-full border border-brand text-brand shadow-xl",
                            )}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            onClick={onClose}
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "w-full bg-brand text-white hover:bg-brand-hover",
                            )}
                        >
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function Navbar({ variant = "default", authLink }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isAuth = variant === "auth";
    const isApp = variant === "app";
    const isDefault = variant === "default";
    const showMobileMenu = isDefault || isApp;

    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header
            className={cn(
                "w-full border-b bg-surface text-brand",
                (isAuth || isApp) ? "shadow-xs" : "shadow-none",
            )}
        >
            <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 md:px-10">
                <Link
                    to="/"
                    className="flex shrink-0 items-center gap-2 font-semibold text-brand"
                >
                    <SpaceHubLogo className="size-7" />
                    <span>SpaceHub</span>
                </Link>

                {isDefault ? (
                    <nav
                        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex lg:gap-8"
                        aria-label="Main"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-brand transition-colors hover:text-brand-hover"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                ) : null}

                {isAuth && authLink ? (
                    <div className="ml-auto min-w-0">
                        <AuthPrompt authLink={authLink} />
                    </div>
                ) : null}

                {isDefault || isApp ? <UserActions onLogout={handleLogout} /> : null}

                {showMobileMenu ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto shrink-0 text-brand md:hidden"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMobileOpen((open) => !open)}
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </Button>
                ) : null}
            </div>

            {showMobileMenu && mobileOpen ? (
                <MobileNav
                    showHomeLinks={isDefault}
                    onClose={() => setMobileOpen(false)}
                    onLogout={handleLogout}
                />
            ) : null}
        </header>
    );
}
