import React, { FormEvent } from "react";

export default function TitleInput({
  placeholder,
  onSubmit,
  required = false,
  value,
}: {
  placeholder: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  required?: boolean;
  value?: string;
}) {
  function onSubmitWrap(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(e);
  }

  return (
    <form
      className="flex justify-center"
      onSubmit={onSubmitWrap}
      noValidate
      spellCheck={false}
    >
      <input
        name={"player"}
        className="placeholder:text-stone-600 w-full text-center font-extrabold bg-clip-text text-transparent
                bg-gradient-to-r from-purple-600 to-yellow-600 dark:caret-stone-300/30 caret-stone-900
                focus:outline-none box-shadow-xl text-4xl"
        type={"text"}
        placeholder={placeholder}
        maxLength={24}
        required={required}
        defaultValue={value}
      />
    </form>
  );
}
