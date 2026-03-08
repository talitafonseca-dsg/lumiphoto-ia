import React, { useRef, useState } from 'react';
import { Upload, Loader2, Sparkles, Camera } from 'lucide-react';

interface StudioTrialUploadProps {
    onTrialGenerate: (parts: any[], aspectRatio: string, trialType: string) => void;
    isGenerating?: boolean;
    error?: string;
    accentColor?: string;
    ctaLabel?: string;
    descriptionLabel?: string;
    trialType?: string; // 'studio' | 'aniversario' | 'delivery'
}

const STYLE_LABELS: Record<string, string[]> = {
    studio: ['🏢 Executivo Pro', '👨‍👩‍👧 Família Clean', '✨ Inspiracional'],
    aniversario: ['🥂 Estúdio Clean', '🎀 Garden Party', '✨ Balão Dourado'],
    delivery: ['🎬 Estúdio Premium', '🔍 Close-up HD', '🏙️ Rooftop Urbano'],
};

// Compress image to max 1280px to avoid mobile upload timeouts
function compressImage(file: File, maxPx = 1280, quality = 0.82): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
                const w = Math.round(img.width * scale);
                const h = Math.round(img.height * scale);
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

const StudioTrialUpload: React.FC<StudioTrialUploadProps> = ({
    onTrialGenerate,
    isGenerating,
    error,
    accentColor = 'from-amber-500 to-orange-500',
    ctaLabel = 'Gerar Minha Foto Grátis',
    descriptionLabel = 'Envie uma selfie e veja 3 estilos de ensaio profissional em segundos',
    trialType = 'studio',
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoName, setPhotoName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoName(file.name);
        compressImage(file).then(setPhoto);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        setPhotoName(file.name);
        compressImage(file).then(setPhoto);
    };

    const handleStart = () => {
        if (!photo || !onTrialGenerate) return;
        const extractBase64 = (dataUrl: string) => {
            const parts = dataUrl.split(',');
            if (parts.length < 2) return null;
            const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
            return { data: parts[1], mimeType: mime };
        };
        const img = extractBase64(photo);
        if (!img) return;

        // Build parts: just the image — backend handles all 3 style prompts
        const parts: any[] = [
            { inlineData: img },
        ];
        onTrialGenerate(parts, '3:4', trialType);
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {!photo ? (
                <div
                    className="relative rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.04] transition-all cursor-pointer p-8 text-center group"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${accentColor} flex items-center justify-center shadow-lg`}>
                        <Camera size={26} className="text-black" />
                    </div>
                    <p className="text-white font-bold text-base mb-1">Envie sua selfie</p>
                    <p className="text-white/40 text-sm mb-4">{descriptionLabel}</p>
                    <div className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${accentColor} rounded-xl font-black text-sm text-black shadow-lg group-hover:scale-105 transition-transform`}>
                        <Upload size={14} /> Escolher Foto
                    </div>
                    <p className="text-white/20 text-[10px] mt-3">Ou arraste e solte aqui</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    {/* Preview */}
                    <div className="relative">
                        <img
                            src={photo}
                            alt="Sua foto"
                            className="w-full max-h-48 object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <button
                            onClick={() => { setPhoto(null); setPhotoName(''); }}
                            className="absolute top-3 right-3 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white/80 text-xs transition-colors"
                        >✕</button>
                        <div className="absolute bottom-3 left-3">
                            <p className="text-white text-xs font-bold truncate max-w-[200px]">{photoName}</p>
                            <p className="text-white/50 text-[10px]">Foto pronta ✓</p>
                        </div>
                    </div>

                    {/* Generate button */}
                    <div className="p-4 space-y-3">
                        {/* Style previews — what will be generated */}
                        <div className="grid grid-cols-3 gap-2">
                            {(STYLE_LABELS[trialType] || STYLE_LABELS['studio']).map((style, i) => (
                                <div key={i} className="text-center p-2 bg-white/[0.04] rounded-xl border border-white/5">
                                    <p className="text-[9px] text-white/60 font-bold leading-tight">{style}</p>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 font-bold">⚠️ {error}</p>
                        )}

                        <button
                            onClick={handleStart}
                            disabled={isGenerating}
                            className={`w-full py-4 rounded-xl font-black text-sm transition-all ${isGenerating
                                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                : `bg-gradient-to-r ${accentColor} text-black shadow-lg hover:scale-[1.02] active:scale-[0.98]`
                                }`}
                        >
                            {isGenerating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    Gerando 3 fotos... (30s)
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Sparkles size={16} />
                                    {ctaLabel}
                                </span>
                            )}
                        </button>

                        <p className="text-center text-white/25 text-[10px]">
                            ✓ Grátis • ✓ Sem cadastro • ✓ HD disponível após pagamento
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudioTrialUpload;
