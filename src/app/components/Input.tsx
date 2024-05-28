const LONGEST_PLAYER_NAME = 24; // the longest name ever is 24 characters (including space) - Martynas Andriuškevičius

interface Props {
    className?: string;
    placeholder: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

export default function Input({
    className,
    placeholder,
    required = true,
    onChange,
    value,
    onFocus,
    onBlur,
}: Props) {
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
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );
}
