import { FormEvent } from "react";

export default function SuggestionBox({
    suggestions,
    onSubmit,
}: {
    suggestions: string[];
    onSubmit: (e: FormEvent<HTMLButtonElement>) => void;
}) {
    function handleSubmit(e: FormEvent<HTMLButtonElement>) {
        e.preventDefault();

        onSubmit(e);
    }

    // TODO: Light mode
    // TODO: Scrolling
    // TODO: Don't overflow the screen
    return (
        <div className="absolute z-10 my-1 rounded-md border bg-stone-200 py-1 shadow-xl dark:border-stone-700 dark:bg-stone-800">
            <ul className="flex flex-col text-lg font-semibold dark:divide-stone-500 dark:text-stone-200">
                {suggestions.slice(0, 5).map((suggestion) => (
                    <button
                        className="mx-1 rounded-lg px-4 py-4 text-left hover:bg-purple-400 active:bg-stone-500 dark:hover:bg-purple-500 dark:hover:text-stone-900 dark:active:bg-purple-600 dark:active:text-stone-900"
                        onClick={handleSubmit}
                        key={suggestion}
                    >
                        {suggestion}
                    </button>
                ))}
            </ul>
        </div>
    );
}
