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

    return (
        <div className="rounded-md bg-stone-200 py-1 shadow-md dark:bg-stone-400">
            <ul className="flex flex-col divide-y divide-stone-300 text-xl font-semibold dark:divide-stone-500">
                {suggestions.slice(0, 5).map((suggestion) => (
                    <button
                        className="p-2 hover:bg-stone-400 active:bg-stone-500 dark:hover:bg-stone-500 dark:active:bg-stone-600"
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
