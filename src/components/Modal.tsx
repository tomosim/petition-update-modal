import { useRef, type ReactNode } from 'react';

type ModalProps = {
    onClose: () => void;
    children: ReactNode;
    ariaLabel?: string;
};

export default function Modal({
    onClose,
    children,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    return (
        <div

            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                background: 'rgba(0, 0, 0, 0.5)',
            }}
        >

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label="modal petition update form"
                tabIndex={-1}
                style={{
                    width: 'min(100%, 670px)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: 16,
                    background: '#fff',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
            >
                <header style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'flex-start', alignItems: 'center', height: 54, }}>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        style={{ border: 0, background: 'none', fontSize: 24, cursor: 'pointer' }}
                    >
                        {/* TODO: make into actual icon */}
                        &times;
                    </button>
                </header>
                {children}
            </div>
        </div>
    );
}