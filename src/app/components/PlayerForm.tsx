import React, { FormEvent, useEffect, useState } from "react";
import SuggestionBox from "@/app/components/SuggestionBox";
import Input from "@/app/components/Input";
import players from "@/app/data/players.json";

interface Props {
    placeholder: string;
    onSubmit: (name: string) => void;
    required?: boolean;
    defaultValue?: string;
    className?: string;
    label?: string;
}

// TODO: Suggestions should be absolute
// TODO: Highlight when active
export default function PlayerForm({
    placeholder,
    onSubmit,
    required = false,
    defaultValue,
    className,
    label,
}: Props) {
    const [autoComplete, setAutoComplete] = useState<string[]>([]);
    const [value, setValue] = useState<string>(defaultValue || "");
    const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
    const [isClicking, setIsClicking] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // Set to remove duplicate player names
    const playerList = Array.from(
        new Set(
            players
                .map((player) => player[3])
                .filter(
                    (playerName) => typeof playerName === "string",
                ) as string[],
        ),
    );

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
        } else if (playerList) {
            setAutoComplete(
                playerList.filter((suggestion) =>
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
        setAutoComplete([e.currentTarget.textContent || ""]);
        setShowAutoComplete(false);
        onSubmit(e.currentTarget.textContent || "");
    }

    function handleFocus() {
        setIsFocused(true);
        setShowAutoComplete(true);
    }

    function handleBlur() {
        setIsFocused(false);
        if (!isClicking) {
            setShowAutoComplete(false);
        }
    }

    function handleMouseDown() {
        setIsClicking(true);
    }

    useEffect(() => {
        function handleOutsideClick() {
            if (!isClicking) {
                setShowAutoComplete(false);
            }
            setIsClicking(false);
        }

        document.addEventListener("mouseup", handleOutsideClick);

        return () => {
            document.removeEventListener("mouseup", handleOutsideClick);
        };
    }, [isClicking, isFocused]);

    return (
        <form
            onMouseDown={handleMouseDown}
            className="relative"
            onSubmit={handleSubmit}
            noValidate
            spellCheck={false}
        >
            <fieldset
                className={
                    label
                        ? "rounded-lg border-2 border-stone-700 pb-3 dark:border-stone-400"
                        : ""
                }
            >
                {label && (
                    <legend className="text-md ml-4 px-2 font-semibold text-stone-700 dark:text-stone-400">
                        {label}
                    </legend>
                )}
                <Input
                    className={className}
                    placeholder={placeholder}
                    required={required}
                    onChange={handleInputChange}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </fieldset>
            {showAutoComplete && autoComplete.length > 0 && (
                <SuggestionBox
                    suggestions={autoComplete}
                    onSubmit={handleAutoCompleteSubmit}
                />
            )}
        </form>
    );
}
