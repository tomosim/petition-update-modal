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
        ...nativeProps
    } = props;

    const errorId = `${id}-error`;
    const ariaDescribedBy = [describedBy, error ? errorId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div className={wrapperClassName} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                />
            ) : (
                <input
                    {...(nativeProps as InputHTMLAttributes<HTMLInputElement>)}
                    id={id}
                    className={className}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={ariaDescribedBy}
                />
            )}

            {error && (
                <p id={errorId} className={errorClassName} role="alert" style={{ color: 'red', margin: 0 }}>
                    {error}
                </p>
            )}
        </div>
    );
}