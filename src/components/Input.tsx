import type {
    InputHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react';
import styles from './Input.module.css';

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
    const wrapperClasses = [styles.wrapper, wrapperClassName].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            <label htmlFor={id} className={labelClassName}>
                {label}
            </label>

            {as === 'textarea' ? (
                <textarea
                    {...(nativeProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    id={id}
                    className={[styles.input, styles.textarea, className].filter(Boolean).join(' ')}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={ariaDescribedBy}
                />
            ) : (
                <input
                    {...(nativeProps as InputHTMLAttributes<HTMLInputElement>)}
                    id={id}
                    className={[styles.input, className].filter(Boolean).join(' ')}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={ariaDescribedBy}
                />
            )}

            {charLimit && (
                <p className={[styles.charLimit, charLimitExceeded ? styles.charLimitExceeded : undefined].filter(Boolean).join(' ')}>
                    {charCount}/{charLimit} Zeichen
                </p>
            )}

            {error && (
                <p id={errorId} className={[styles.error, errorClassName].filter(Boolean).join(' ')} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}