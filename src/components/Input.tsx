import type {
    InputHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react';

type CommonProps = {
    id: string;
    label: string;
    error?: string;
    className?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    'aria-describedby'?: string;
    charCount?: number;
    charLimit?: number;
};

type InputProps = CommonProps & (
    | ({
        as?: 'input';
    } & Omit<InputHTMLAttributes<HTMLInputElement>, keyof CommonProps | 'id' | 'aria-invalid'>)
    | ({
        as: 'textarea';
    } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof CommonProps | 'id' | 'aria-invalid'>)
);

export default function Input(props: InputProps) {
    const {
        as = 'input',
        id,
        label,
        error,
        className,
        wrapperClassName,
        labelClassName,
        errorClassName,
        'aria-describedby': describedBy,
        charCount,
        charLimit,
        ...nativeProps
    } = props;

    const errorId = `${id}-error`;
    const ariaDescribedBy = [describedBy, error ? errorId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;
    const charLimitExceeded = charLimit !== undefined && charCount !== undefined && charCount > charLimit;

    return (
        <div className={wrapperClassName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, gridColumnStart: 1, gridColumnEnd: 3 }}>
            <label htmlFor={id} className={labelClassName}>
                {label}
            </label>

            {as === 'textarea' ? (
                <textarea
                    {...(nativeProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    id={id}
                    className={className}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={ariaDescribedBy}
                    style={{ minHeight: 100, width: '-moz-available', padding: 8 }}
                />
            ) : (
                <input
                    {...(nativeProps as InputHTMLAttributes<HTMLInputElement>)}
                    id={id}
                    className={className}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={ariaDescribedBy}
                    style={{ width: '-moz-available', padding: 8 }}
                />
            )}

            {charLimit && (
                <p style={{ color: charLimitExceeded ? 'red' : 'inherit' }}> {charCount}/{charLimit} Zeichen</p>
            )}

            {error && (
                <p id={errorId} className={errorClassName} role="alert" style={{ color: 'red', margin: 0 }}>
                    {error}
                </p>
            )}
        </div>
    );
}