interface ScrollbarProps {
    children: React.ReactNode;
    className?: string;
}

export default function Scrollbar({ children, className }: ScrollbarProps) {
    return (
        <div
            className={`${className} overflow-auto scrollbar scrollbar-thumb-stone-400
            scrollbar-thumb-rounded-xl scrollbar-w-1.5 hover:scrollbar-thumb-stone-500
            active:scrollbar-thumb-stone-600 dark:scrollbar-thumb-stone-700
            dark:hover:scrollbar-thumb-stone-600 dark:active:scrollbar-thumb-stone-500`}
        >
            {children}
        </div>
    );
}
