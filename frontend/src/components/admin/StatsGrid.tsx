export function StatsGrid({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {children}
        </div>
    );
}
