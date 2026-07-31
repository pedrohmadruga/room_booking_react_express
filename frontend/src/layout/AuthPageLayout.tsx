import PageLayout from "@/layout/PageLayout";

export default function AuthPageLayout({
    authLink,
    children,
}: Readonly<{ authLink: "login" | "register"; children: React.ReactNode }>) {
    return (
        <PageLayout
            variant="auth"
            authLink={authLink}
            mainClassName="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-10"
        >
            {children}
        </PageLayout>
    );
}
