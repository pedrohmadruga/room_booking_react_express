import PageLayout from "@/layout/PageLayout";
import Hero from "@/sections/homepage/Hero";
import RoomsPreview from "@/sections/homepage/RoomsPreview";
import HowItWorks from "@/sections/homepage/HowItWorks";
import ReadyToReserve from "@/sections/homepage/ReadyToReserve";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function HomePage() {
    return (
        <PageLayout>
            <Hero />
            <RevealOnScroll>
                <RoomsPreview />
            </RevealOnScroll>
            <RevealOnScroll delayMs={80}>
                <HowItWorks />
            </RevealOnScroll>
            <RevealOnScroll delayMs={80}>
                <ReadyToReserve />
            </RevealOnScroll>
        </PageLayout>
    );
}
