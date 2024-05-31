import { FormEvent } from "react";
import Scrollbar from "./Scrollbar";

export default function SuggestionBox({
    suggestions,
    onSubmit,
    positionAboveParent = false,
}: {
    suggestions: string[];
    onSubmit: (e: FormEvent<HTMLButtonElement>) => void;
    positionAboveParent?: boolean;
}) {
    function handleSubmit(e: FormEvent<HTMLButtonElement>) {
        e.preventDefault();

        onSubmit(e);
    }

    // TODO: Scrolling
    return (
        <div
            style={positionAboveParent ? { bottom: "100%" } : { top: "100%" }}
            className="absolute inset-x-0 z-10 my-1 rounded-md bg-stone-200 py-1 shadow-xl
                dark:border dark:border-stone-700 dark:bg-stone-800"
        >
            <Scrollbar>
                <ul className="flex flex-col text-lg font-semibold dark:text-stone-200">
                    {suggestions
                        .slice(0, 5)
                        .map((suggestion) =>
                            PlayerSuggestionButton(handleSubmit, suggestion),
                        )}
                    {suggestions.length > 5 && (
                        <div className="flex h-0 flex-col">
                            {suggestions
                                .slice(5, 20)
                                .map((suggestion) =>
                                    PlayerSuggestionButton(
                                        handleSubmit,
                                        suggestion,
                                    ),
                                )}
                        </div>
                    )}
                </ul>
            </Scrollbar>
        </div>
    );
}
function PlayerSuggestionButton(
    handleSubmit: (e: FormEvent<HTMLButtonElement>) => void,
    suggestion: string,
) {
    return (
        <button
            className="mx-1 rounded-lg px-4 py-4 text-left hover:bg-purple-400/50 hover:shadow-md
                active:bg-purple-700/50 active:shadow-md dark:hover:bg-purple-500
                dark:hover:text-stone-900 dark:active:bg-purple-600 dark:active:text-stone-900"
            onClick={handleSubmit}
            key={suggestion}
        >
            {suggestion}
        </button>
    );
}
