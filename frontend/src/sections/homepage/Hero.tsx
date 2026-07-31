import { Button } from "@/components/ui/button";
import {
    CalendarIcon,
    ClockIcon,
    ShieldIcon,
} from "@/components/icons";
import { useNavigate } from "react-router-dom";

const features = [
    {
        icon: CalendarIcon,
        lines: ["Fast and easy", "booking"],
    },
    {
        icon: ShieldIcon,
        lines: ["Equipped and", "comfortable environment"],
    },
    {
        icon: ClockIcon,
        lines: ["Book by", "period"],
    },
] as const;

export default function Hero() {
    const navigate = useNavigate();
    return (
        <section className="w-full bg-surface-soft md:relative md:flex md:min-h-[70vh] md:items-center md:justify-center md:bg-[url('/images/hero.jpg')] md:bg-cover md:bg-center">
            {/* Mobile: image on top */}
            <div className="relative h-56 w-full sm:h-64 md:hidden">
                <img
                    src="/images/hero.jpg"
                    alt="Modern meeting room"
                    className="size-full object-cover"
                />
            </div>

            {/* Desktop: gradient over the background image */}
            <div
                className="absolute inset-0 hidden bg-gradient-to-r from-surface-soft from-30% via-surface-soft/70 via-65% to-transparent to-70% md:block"
                aria-hidden
            />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl items-start px-4 py-10 sm:px-6 md:min-h-[70vh] md:px-10 md:pt-14 md:pb-14">
                <div className="w-full max-w-3xl">
                    <div className="max-w-sm">
                        <h1 className="text-4xl font-semibold !text-brand md:text-5xl">
                            The ideal space for your ideas to grow
                        </h1>
                        <p className="mt-4 text-lg text-brand">
                            Reserve modern and equipped rooms by period and
                            focus on what really matters.
                        </p>

                        <Button
                            size="lg"
                            className="mt-4 bg-brand px-6 text-white hover:bg-brand-hover"
                            onClick={() => navigate("/rooms")}
                        >
                            See rooms
                        </Button>
                    </div>

                    <div className="mt-10 flex flex-col gap-5 text-sm text-brand sm:flex-row sm:items-center sm:gap-8 md:mt-16">
                        {features.map(({ icon: Icon, lines }) => (
                            <div
                                key={lines[0]}
                                className="flex items-center gap-3"
                            >
                                <Icon className="size-7 shrink-0" />
                                <span className="leading-snug">
                                    {lines[0]}
                                    <br />
                                    {lines[1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
