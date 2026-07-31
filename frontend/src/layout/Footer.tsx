import { WifiIcon, MonitorIcon, CoffeeIcon, LockIcon } from "@/components/icons";

const footerLabels = [
    {
        icon: WifiIcon,
        label: "High-speed WiFi",
    },
    {
        icon: MonitorIcon,
        label: "Modern equipment",
    },
    {
        icon: CoffeeIcon,
        label: "Comfortable seating",
    },
    {
        icon: LockIcon,
        label: "Privacy and security",
    },
]

export default function Footer() {
    return (
        <footer id="contact" className="scroll-mt-20 bg-brand-panel text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-10">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:items-center md:text-left">
                    <div className="flex w-full flex-wrap items-center justify-between gap-y-4">
                        {footerLabels.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2">
                                <Icon className="size-6 shrink-0" />
                                <span className="text-sm">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
