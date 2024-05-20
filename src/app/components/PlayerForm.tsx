import React, { FormEvent, useState } from "react";

const LONGEST_PLAYER_NAME = 24; // the longest name ever is 24 characters (including space) - Martynas Andriuškevičius

function Input({
    className,
    placeholder,
    required = true,
    onChange,
    value,
}: {
    className?: string;
    placeholder: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
}) {
    return (
        <input
            id={"player"}
            name={"player"}
            className={
                "box-shadow-xl bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text font-extrabold " +
                "text-transparent caret-stone-900 placeholder:text-stone-700 focus:outline-none " +
                "dark:caret-stone-300/30 " +
                className
            }
            type={"text"}
            placeholder={placeholder}
            maxLength={LONGEST_PLAYER_NAME}
            required={required}
            onChange={onChange}
            value={value}
        />
    );
}

function SuggestionBox({
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
        <div className="rounded-md bg-stone-400 py-1">
            <ul className="flex flex-col divide-y divide-stone-500 text-xl">
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

interface Props {
    placeholder: string;
    onSubmit: (name: string) => void;
    required?: boolean;
    defaultValue?: string;
    className?: string;
    label?: string;
    suggestions?: string[];
}

export default function PlayerForm({
    placeholder,
    onSubmit,
    required = false,
    defaultValue,
    className,
    label,
    suggestions,
}: Props) {
    const [autoComplete, setAutoComplete] = useState<string[]>([]);
    const [value, setValue] = useState<string>(defaultValue || "");

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const playerName = formData.get("player") as string | null;
        onSubmit(playerName || "");
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        if (e.target.value === "") {
            setAutoComplete([]);
        } else if (suggestions) {
            setAutoComplete(
                suggestions.filter((suggestion) =>
                    suggestion
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()),
                ),
            );
        }
    }

    function handleAutoCompleteSubmit(e: FormEvent<HTMLButtonElement>) {
        e.preventDefault();
        setValue(e.currentTarget.textContent || "");
        onSubmit(e.currentTarget.textContent || "");
    }

    return (
        <form onSubmit={handleSubmit} noValidate spellCheck={false}>
            <fieldset
                className={
                    label ? "rounded-lg border-2 border-stone-400 pb-3" : ""
                }
            >
                {label && (
                    <legend className="text-md ml-4 px-2 font-semibold text-stone-400">
                        {label}
                    </legend>
                )}
                <Input
                    className={className}
                    placeholder={placeholder}
                    required={required}
                    onChange={handleInputChange}
                    value={value}
                />
            </fieldset>
            {autoComplete.length > 0 && (
                <SuggestionBox
                    suggestions={autoComplete}
                    onSubmit={handleAutoCompleteSubmit}
                />
            )}
        </form>
    );
}
