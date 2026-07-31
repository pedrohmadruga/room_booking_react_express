import { Button } from "@/components/ui/button";

export default function ReadyToReserve() {
    return (
        <section
            id="about"
            className="mx-auto my-10 w-full max-w-7xl scroll-mt-20 rounded-2xl bg-brand-panel px-4 py-10 sm:px-6 md:px-10"
        >
            <div className="flex flex-col items-center justify-between gap-6 text-center text-white md:flex-row md:items-center md:text-left">
                <div className="flex flex-col items-center gap-2 md:items-start">
                    <h2 className="text-2xl font-bold !text-white md:text-3xl">
                        Ready to reserve?
                    </h2>
                    <p className="max-w-xs text-sm">
                        Create your account and get easy access to all available rooms.
                    </p>
                </div>

                <Button className="bg-white px-6 py-6 text-brand hover:bg-white/90">
                    Create free account
                </Button>
            </div>
        </section>
    );
}
