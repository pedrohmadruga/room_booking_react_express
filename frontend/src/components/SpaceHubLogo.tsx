export default function SpaceHubLogo({
    className,
}: Readonly<{ className?: string }>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            className={className}
            aria-hidden="true"
        >
            {/* Hexagon — the hub / space container */}
            <path
                d="M16 2.75 26.75 9v14L16 29.25 5.25 23V9L16 2.75Z"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinejoin="round"
            />
            {/* Room outline with open door on the bottom edge */}
            <path
                d="M11.25 12.25h9.5v7.75H18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.25 20V12.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            {/* Meeting table — booking a shared space */}
            <rect
                x="13.75"
                y="14.5"
                width="4.5"
                height="3.25"
                rx="0.7"
                fill="currentColor"
            />
        </svg>
    );
}
