import React, {FormEvent} from "react";

export default function TitleInput({placeholder, onSubmit}: {
    placeholder: string,
    onSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {
    function onSubmitWrap(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit(e);
    }

    return <div className="flex justify-center items-center">
        <form className="flex justify-center py-4 my-4 w-full" onSubmit={onSubmitWrap}>
            <input
                name={"player"}
                className="w-full text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-600 text-5xl sm:text-6xl lg:text-8xl caret-stone-200 focus:outline-none"
                type={"text"} placeholder={placeholder} maxLength={24}/>

        </form>
    </div>
}