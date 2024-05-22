import React, { FormEvent, useState } from "react";
import SuggestionBox from "@/app/components/SuggestionBox";
import Input from "@/app/components/Input";

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
