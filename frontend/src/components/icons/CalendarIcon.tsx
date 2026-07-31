import type { IconProps } from "./types";

export function CalendarIcon({ className }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden
        >
            <rect
                x="3.5"
                y="5"
                width="17"
                height="15"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.75"
            />
            <path
                d="M3.5 9.5h17"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <path
                d="M8 3.5v3M16 3.5v3"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
        </svg>
    );
}
