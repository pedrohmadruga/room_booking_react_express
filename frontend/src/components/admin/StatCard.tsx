import { cn } from "@/lib/utils";

type StatCardProps = Readonly<{
    label: string;
    value: string | number;
    helper: string;
    icon: React.ReactNode;
    iconClassName?: string;
}>;

export default function StatCard({
    label,
    value,
    helper,
    icon,
    iconClassName,
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        iconClassName,
                    )}
                >
                    {icon}
                </div>
                <span className="pt-1 text-right text-xs font-medium text-slate-500">
                    {label}
                </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-brand">
                {value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{helper}</p>
        </div>
    );
}
