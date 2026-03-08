import React, { useState } from 'react';

interface UrgencyBannerProps {
    text?: string;
    onCtaClick?: () => void;
    ctaText?: string;
}

const UrgencyBanner: React.FC<UrgencyBannerProps> = ({
    text = 'OFERTA RELÂMPAGO — PRIMEIRAS 48H: 40% OFF NO PACOTE PRO — RESTAM APENAS 7 VAGAS',
    onCtaClick,
    ctaText,
}) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div
            className="relative w-full z-[90]"
            style={{
                background: 'linear-gradient(90deg, #c8000a 0%, #e8000a 40%, #c8000a 100%)',
            }}
        >
            <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 px-8 py-2">
                <div className="flex-1 overflow-hidden">
                    <p className="text-center text-white font-black tracking-wide whitespace-nowrap text-[11px] sm:text-xs md:text-sm">
                        <span className="inline-flex items-center gap-2">
                            <span style={{ filter: 'drop-shadow(0 0 4px gold)' }}>⚡</span>
                            {text}
                            <span style={{ filter: 'drop-shadow(0 0 4px gold)' }}>⚡</span>
                        </span>
                    </p>
                </div>
                {ctaText && onCtaClick && (
                    <button
                        onClick={onCtaClick}
                        className="shrink-0 ml-4 px-3 py-1 bg-yellow-400 text-red-900 text-[10px] sm:text-xs font-black rounded-full uppercase tracking-wider hover:bg-yellow-300 transition-colors"
                    >
                        {ctaText}
                    </button>
                )}
                <button
                    onClick={() => setVisible(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs leading-none p-1"
                    aria-label="Fechar"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default UrgencyBanner;
