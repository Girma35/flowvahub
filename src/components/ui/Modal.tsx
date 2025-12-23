import React, { useEffect } from 'react';
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    type?: 'confirm' | 'alert' | 'success' | 'error';
    icon?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    type = 'confirm',
    icon
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const iconMap = {
        confirm: 'fa-question-circle text-blue-400',
        alert: 'fa-exclamation-triangle text-yellow-500',
        success: 'fa-check-circle text-green-500',
        error: 'fa-times-circle text-red-500'
    };

    const displayIcon = icon || iconMap[type].split(' ')[0];
    const iconColor = icon ? 'text-blue-400' : iconMap[type].split(' ')[1];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-inner`}>
                        <i className={`fa-solid ${displayIcon} ${iconColor} text-4xl`}></i>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{title}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                        {type === 'confirm' && (
                            <Button
                                variant="secondary"
                                onClick={onClose}
                                className="flex-1 rounded-2xl py-3.5"
                            >
                                {cancelLabel}
                            </Button>
                        )}
                        <Button
                            variant={type === 'error' ? 'secondary' : (type === 'success' ? 'primary' : 'primary')}
                            onClick={() => {
                                if (onConfirm) {
                                    onConfirm();
                                } else {
                                    onClose();
                                }
                            }}
                            className="flex-1 rounded-2xl py-3.5 shadow-xl shadow-blue-500/10"
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
