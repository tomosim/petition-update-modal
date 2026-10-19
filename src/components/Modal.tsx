import { useEffect, useRef, type ReactNode } from 'react';
import styles from './Modal.module.css';

type ModalProps = {
    children: ReactNode;
    ariaLabel?: string;
    ariaLabelledBy?: string;
};

export default function Modal({
    children,
    ariaLabel,
    ariaLabelledBy,
}: ModalProps) {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = modalRef.current;
        if (!dialog) return;

        dialog.showModal();

        return () => {
            if (dialog.open) dialog.close();
        };
    }, []);

    return (
        <dialog
            ref={modalRef}
            className={styles.modal}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
        >
            {children}
        </dialog>
    );
}