import type { IconProps } from "./types";

export function CoffeeIcon({ className }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden
        >
            <path
                d="M6 9h10v6.5a3.5 3.5 0 0 1-3.5 3.5h-3A3.5 3.5 0 0 1 6 15.5V9Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
            <path
                d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 4.5c0 .8-.4 1.3-.4 2M12 4.5c0 .8-.4 1.3-.4 2M15 4.5c0 .8-.4 1.3-.4 2"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
        </svg>
    );
}
