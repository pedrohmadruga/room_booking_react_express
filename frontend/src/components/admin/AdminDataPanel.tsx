type AdminDataPanelProps = Readonly<{
    title: string;
    children: React.ReactNode;
}>;

export default function AdminDataPanel({ title, children }: AdminDataPanelProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-brand">{title}</h2>
            </div>
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
}
