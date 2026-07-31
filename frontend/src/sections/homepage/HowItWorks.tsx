import { Fragment } from "react";
import { CalendarIcon, CheckIcon, SearchIcon } from "@/components/icons";
import { ArrowRightIcon } from "lucide-react";

const steps = [
    {
        icon: SearchIcon,
        title: "1. Choose a room",
        lines: ["Find the ideal room", "for your needs."],
    },
    {
        icon: CalendarIcon,
        title: "2. Choose a date and period",
        lines: ["Select the date", "and period for your booking."],
    },
    {
        icon: CheckIcon,
        title: "3. Ready!",
        lines: ["Use your room", "and enjoy your time."],
    },
] as const;

export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="mx-auto my-10 w-full max-w-7xl scroll-mt-20 rounded-2xl bg-gray-100 px-4 py-10 sm:px-6 md:px-10"
        >
            <div className="w-full text-center text-brand">
                <h2 className="text-2xl font-bold !text-brand md:text-3xl">
                    How it Works
                </h2>

                <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-6">
                    {steps.map(({ icon: Icon, title, lines }, index) => (
                        <Fragment key={title}>
                            <div className="flex max-w-[220px] flex-col items-center text-center">
                                <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-white shadow-sm md:size-24">
                                    <Icon className="size-8 text-brand md:size-10" />
                                </div>
                                <p className="font-bold text-brand">{title}</p>
                                <p className="mt-1 text-sm text-brand">
                                    {lines[0]}
                                    <br />
                                    {lines[1]}
                                </p>
                            </div>

                            {index < steps.length - 1 ? (
                                <ArrowRightIcon className="mt-8 hidden size-6 shrink-0 text-brand md:block" />
                            ) : null}
                        </Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
