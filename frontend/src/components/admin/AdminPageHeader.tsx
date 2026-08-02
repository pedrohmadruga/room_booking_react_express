type AdminPageHeaderProps = Readonly<{
    title: string;
    description: string;
    action?: React.ReactNode;
}>;

export default function AdminPageHeader({
    title,
    description,
    action,
}: AdminPageHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-brand">
                    {title}
                </h1>
                {action}
            </div>
            <p className="mt-1.5 max-w-xl text-sm text-slate-500">{description}</p>
        </div>
    );
}
