import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealOnScrollProps = Readonly<{
    children: React.ReactNode;
    className?: string;
    delayMs?: number; 
}>;

export default function RevealOnScroll({
    children,
    className,
    delayMs = 0,
}: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(node);
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-700 ease-out",
                visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                className,
            )}
            style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}
