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
        <div className=" rounded-md bg-stone-400 py-1 shadow-md">
            <ul className="flex flex-col divide-y divide-stone-500 text-xl font-semibold">
                {suggestions.slice(0, 5).map((suggestion) => (
                    <button
                        className="p-2 hover:bg-stone-500 active:bg-stone-600"
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
