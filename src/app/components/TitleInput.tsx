import React, { FormEvent } from "react";

export default function TitleInput({
    placeholder,
    onSubmit,
    required = false,
    centered = false,
    value,
    className,
    label,
}: {
    placeholder: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    required?: boolean;
    centered?: boolean;
    value?: string;
    className?: string;
    label?: string;
}) {
    function onSubmitWrap(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit(e);
    }

    const inputElement = (
        <input
            id={"player"}
            name={"player"}
            className={
                "box-shadow-xl bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text font-extrabold " +
                "text-transparent caret-stone-900 placeholder:text-stone-700 focus:outline-none " +
                "dark:caret-stone-300/30 " +
                className
            }
            style={{
                textAlign: centered ? "center" : "left",
            }}
            type={"text"}
            placeholder={placeholder}
            maxLength={24}
            required={required}
            defaultValue={value}
        />
    );

    return (
        <form
            // className={}
            onSubmit={onSubmitWrap}
            noValidate
            spellCheck={false}
        >
            {label && (
                <fieldset className="rounded-lg border-2 border-stone-400 pb-3">
                    <legend className="text-md ml-4 px-2 font-semibold text-stone-400">
                        {label}
                    </legend>
                    {inputElement}
                </fieldset>
            )}
            {!label && inputElement}
        </form>
    );
}
