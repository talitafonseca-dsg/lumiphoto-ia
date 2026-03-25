import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Sparkles, Camera, Users, X, Film, Loader2, Download,
  Crown, Star, Shirt, ShoppingBag, ChevronRight
} from 'lucide-react';
import { AspectRatio } from '../types';
import { ModaGenerationConfig } from '../services/geminiService';
import { submitVideoGeneration, waitForVideo } from '../services/videoService';

// ============================================================
// MODA STYLES — organized by category
// ============================================================
type ModaStyleCategory = 'popular' | 'editorial' | 'lifestyle' | 'creative';

interface ModaStyle {
  id: string;
  label: string;
  desc: string;
  emoji: string;
  thumb: string;
  category: ModaStyleCategory;
}

const MODA_STYLES: ModaStyle[] = [
  // Popular / Social Media
  { id: 'TikTok Viral', label: 'TikTok Viral', desc: 'Pose dinâmica, ring light', emoji: '📱', thumb: '/styles/tiktok.png', category: 'popular' },
  { id: 'Mirror Selfie', label: 'Mirror Selfie', desc: 'Selfie no espelho, IG style', emoji: '🪞', thumb: '/styles/mirror.png', category: 'popular' },
  { id: 'Provador', label: 'Provador', desc: 'No provador da loja', emoji: '🛍️', thumb: '/styles/provador.png', category: 'popular' },
  { id: 'Look do Dia', label: 'Look do Dia', desc: '#OOTD casual urbano', emoji: '✌️', thumb: '/styles/lookdodia.png', category: 'popular' },
  { id: 'E-Commerce Pro', label: 'E-Commerce', desc: 'Fundo branco profissional', emoji: '🏪', thumb: '/styles/ecommerce.png', category: 'popular' },
  { id: 'Flat Lay', label: 'Flat Lay', desc: 'Peças dispostas, vista aérea', emoji: '📐', thumb: '/styles/flatlay.png', category: 'popular' },
  // Editorial / Luxo
  { id: 'Editorial Vogue', label: 'Editorial Vogue', desc: 'Alta moda, contraste dramático', emoji: '📸', thumb: '/styles/vogue.png', category: 'editorial' },
  { id: 'Luxury Gold', label: 'Luxury Gold', desc: 'Elegância & opulência dourada', emoji: '✨', thumb: '/styles/luxurygold.png', category: 'editorial' },
  { id: 'Old Money', label: 'Old Money', desc: 'Herança clássica, sofisticação', emoji: '🏛️', thumb: '/styles/oldmoney.png', category: 'editorial' },
  { id: 'Passarela', label: 'Passarela', desc: 'Desfile, runway fashion', emoji: '👠', thumb: '/styles/passarela.png', category: 'editorial' },
  { id: 'Backstage', label: 'Backstage', desc: 'Bastidores do desfile', emoji: '🎬', thumb: '/styles/backstage.png', category: 'editorial' },
  { id: 'Noiva Luxo', label: 'Noiva Luxo', desc: 'Elegância nupcial premium', emoji: '💍', thumb: '/styles/noiva.png', category: 'editorial' },
  // Lifestyle / Cenário
  { id: 'Street Fashion', label: 'Street Fashion', desc: 'Moda urbana, estilo de rua', emoji: '🔥', thumb: '/styles/street.png', category: 'lifestyle' },
  { id: 'Golden Hour', label: 'Golden Hour', desc: 'Luz dourada, warm tones', emoji: '🌅', thumb: '/styles/goldenhour.png', category: 'lifestyle' },
  { id: 'Beach Resort', label: 'Beach Resort', desc: 'Praia, resort, verão', emoji: '🏖️', thumb: '/styles/beach.png', category: 'lifestyle' },
  { id: 'Pôr do Sol', label: 'Pôr do Sol', desc: 'Sunset cinematográfico', emoji: '🌇', thumb: '/styles/pordosol.png', category: 'lifestyle' },
  // Lifestyle extras
  { id: 'Café Urbano', label: 'Café Urbano', desc: 'Cafeteria, lifestyle urbano', emoji: '☕', thumb: '/styles/cafe.png', category: 'lifestyle' },
  { id: 'Campo Fazenda', label: 'Campo & Fazenda', desc: 'Rural, natureza, ar livre', emoji: '🌾', thumb: '/styles/campo.png', category: 'lifestyle' },
  // Festa / Noite
  { id: 'Festival', label: 'Festival', desc: 'Música, boho, ar livre', emoji: '🎶', thumb: '/styles/festival.png', category: 'creative' },
  { id: 'Balada Club', label: 'Balada / Club', desc: 'Neon, noite, glamour', emoji: '🪩', thumb: '/styles/balada.png', category: 'creative' },
  { id: 'Glow Beauty', label: 'Glow Beauty', desc: 'Pele perfeita, fresh look', emoji: '💫', thumb: '/styles/glow.png', category: 'creative' },
  { id: 'Natural Clean', label: 'Natural Clean', desc: 'Minimalista, luz natural', emoji: '🌿', thumb: '/styles/natural.png', category: 'creative' },
  // Creative extras
  { id: 'Boho Chic', label: 'Boho Chic', desc: 'Boêmio, artístico, livre', emoji: '🪶', thumb: '/styles/boho.png', category: 'creative' },
  { id: 'Monocromático', label: 'Monocromático', desc: 'P&B dramático, contraste', emoji: '⚫', thumb: '/styles/mono.png', category: 'creative' },
];

const STYLE_CATEGORIES: { id: ModaStyleCategory; label: string; emoji: string }[] = [
  { id: 'popular', label: 'Popular', emoji: '🔥' },
  { id: 'editorial', label: 'Editorial', emoji: '📸' },
  { id: 'lifestyle', label: 'Lifestyle', emoji: '🌿' },
  { id: 'creative', label: 'Criativo', emoji: '🎨' },
];

// ============================================================
// AVATAR PRESETS — Influencer personas
// ============================================================
interface AvatarPreset {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  prompt: string;
  gender: 'feminino' | 'masculino';
}

const AVATAR_PRESETS: AvatarPreset[] = [
  // Feminino
  { id: 'inf-morena', name: 'Morena Brasileira', desc: 'Morena, cabelo ondulado, curvas', emoji: '🇧🇷', gender: 'feminino',
    prompt: 'A gorgeous Brazilian morena woman, naturally tanned golden-brown skin, dark wavy hair, medium body with natural curves. She looks like a popular Brazilian Instagram fashion influencer. Confident, natural beauty.' },
  { id: 'inf-negra', name: 'Negra Poderosa', desc: 'Negra, cabelo crespo/tranças', emoji: '👑', gender: 'feminino',
    prompt: 'A beautiful Black Brazilian woman with deep melanin-rich dark skin, natural afro/coily hair or stylish braids. Confident, powerful, gorgeous. She looks like a top Brazilian fashion influencer celebrating Black beauty.' },
  { id: 'inf-loira', name: 'Loira Influencer', desc: 'Loira, magra, estilo europeu', emoji: '💁‍♀️', gender: 'feminino',
    prompt: 'A Brazilian blonde woman with light skin, straight or wavy blonde hair, slim body. She looks like a glamorous Brazilian fashion blogger with European-inspired style. Polished, chic, photogenic.' },
  { id: 'inf-ruiva', name: 'Ruiva Estilosa', desc: 'Ruiva, cacheada, pele clara', emoji: '🧡', gender: 'feminino',
    prompt: 'A Brazilian redhead woman with fair/light skin, curly red hair, freckles. Unique and stylish, she stands out with her fiery hair and confident fashion sense.' },
  { id: 'inf-oriental', name: 'Oriental BR', desc: 'Descendente asiática brasileira', emoji: '🌸', gender: 'feminino',
    prompt: 'A Brazilian woman of East Asian descent (Japanese/Chinese/Korean heritage), with Asian facial features, straight black hair, light-to-medium skin. She combines Asian elegance with Brazilian vibrancy. Fashion-forward and photogenic.' },
  { id: 'inf-plussize', name: 'Plus Size Diva', desc: 'Plus size, confiante, poderosa', emoji: '💃', gender: 'feminino',
    prompt: 'A beautiful plus-size Brazilian woman, full-figured with curves, round face, full arms and thighs. She is NOT thin — she has a visibly larger body and she is gorgeous, confident, and radiates self-love. Dark wavy hair, morena skin. She looks like a body-positive fashion influencer.' },
  { id: 'inf-madura', name: 'Madura Elegante', desc: '50+, elegância e sofisticação', emoji: '🌹', gender: 'feminino',
    prompt: 'An elegant mature Brazilian woman, 50-65 years old, with graceful aging — silver/salt-and-pepper hair or well-maintained dark hair. Refined features, warm smile. She radiates sophistication and timeless beauty. NOT young — must have age-appropriate features (subtle wrinkles, mature face).' },
  { id: 'inf-teen', name: 'Teen Fashion', desc: 'Adolescente, estilo jovem', emoji: '🎒', gender: 'feminino',
    prompt: 'A Brazilian teenage girl, 14-17 years old, with youthful energy. Dark wavy or curly hair, morena skin, braces optional. School-age look with trendy Gen Z fashion sense. Natural, fun, relatable. Must look like a TEENAGER, not an adult.' },
  { id: 'inf-crianca-f', name: 'Moda Kids (Menina)', desc: 'Criança 5-10 anos', emoji: '🎀', gender: 'feminino',
    prompt: 'A Brazilian girl child, 5-10 years old. Cute, playful, innocent. Dark or brown hair in pigtails or ponytail. Childlike proportions and face — small, round face with big eyes. Must look like a real CHILD, not a teenager or adult. Fun, happy pose appropriate for kid fashion.' },
  // Masculino
  { id: 'inf-moreno-m', name: 'Moreno Brasileiro', desc: 'Moreno, estilo casual', emoji: '🇧🇷', gender: 'masculino',
    prompt: 'A handsome Brazilian moreno man, naturally tanned golden-brown skin, dark short/medium hair, medium-athletic build. He looks like a real Brazilian male fashion influencer — casual, confident, photorealistic.' },
  { id: 'inf-negro-m', name: 'Negro Estiloso', desc: 'Negro, confiante, moderno', emoji: '👑', gender: 'masculino',
    prompt: 'A handsome Black Brazilian man with deep melanin-rich dark skin, short hair or fade cut in modern style. Athletic/medium build. He radiates confidence and modern style. Looks like a top Brazilian male fashion influencer.' },
  { id: 'inf-loiro-m', name: 'Loiro Surfista', desc: 'Loiro, bronzeado, athletic', emoji: '🏄', gender: 'masculino',
    prompt: 'A Brazilian blonde man with tanned skin, light wavy/messy hair, athletic build. Surfer/beach boy vibes typical of Southern Brazil. Casual, easygoing confidence.' },
  { id: 'inf-barbudo', name: 'Barbudo Estiloso', desc: 'Barba feita, estilo urbano', emoji: '🧔', gender: 'masculino',
    prompt: 'A stylish Brazilian man with a well-groomed full beard, dark hair, morena/medium skin tone. Hipster/urban style with masculine confidence. Looks like a male grooming and fashion influencer.' },
  { id: 'inf-plussize-m', name: 'Plus Size Masc', desc: 'Plus size masculino, confiante', emoji: '💪', gender: 'masculino',
    prompt: 'A plus-size Brazilian man, full-figured with visible larger body proportions, round face. He is NOT thin — he has a bigger body and he is confident, well-dressed, and represents body-positive male fashion. Dark hair, morena skin.' },
  { id: 'inf-maduro-m', name: 'Maduro Sofisticado', desc: '50+, grisalho, classe', emoji: '🎩', gender: 'masculino',
    prompt: 'A sophisticated mature Brazilian man, 50-65 years old. Salt-and-pepper or gray hair, possibly a silver beard. Distinguished features with subtle age lines. He radiates class and refined taste. NOT young — must have age-appropriate features.' },
  { id: 'inf-teen-m', name: 'Teen Boy', desc: 'Adolescente masculino', emoji: '🛹', gender: 'masculino',
    prompt: 'A Brazilian teenage boy, 14-17 years old, with youthful energy. Dark hair, morena skin, lean build. Gen Z streetwear style. Natural, casual, relatable. Must look like a TEENAGER, not an adult.' },
  { id: 'inf-crianca-m', name: 'Moda Kids (Menino)', desc: 'Criança 5-10 anos', emoji: '🧸', gender: 'masculino',
    prompt: 'A Brazilian boy child, 5-10 years old. Cute, playful, energetic. Dark or brown hair. Childlike proportions and face — small, round face with big eyes. Must look like a real CHILD, not a teenager or adult. Fun, happy pose appropriate for kid fashion.' },
];

const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: string }[] = [
  { value: AspectRatio.PORTRAIT_4_5, label: '4:5', icon: '📱' },
  { value: AspectRatio.SQUARE, label: '1:1', icon: '⬜' },
  { value: AspectRatio.STORY_9_16, label: '9:16', icon: '📲' },
  { value: AspectRatio.PORTRAIT_3_4, label: '3:4', icon: '🖼️' },
];

// ============================================================

interface GeneratedImage {
  id: string;
  url: string;
  originalUrl?: string;
  variation: number;
}

interface ModaStudioPageProps {
  onNavigateBack: () => void;
  credits: number;
  isGenerating: boolean;
  results: GeneratedImage[];
  error?: string | null;
  isLoggedIn?: boolean;
  onShowPaywall?: () => void;
  onGenerate: (config: ModaGenerationConfig, modelImage: string | null, topImage: string | null, bottomImage: string | null, shoesImage: string | null, dressImage: string | null, bagImage: string | null, accessoryImage: string | null) => void;
  onDownload?: (url: string) => void;
}

const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ModaStudioPage: React.FC<ModaStudioPageProps> = ({
  onNavigateBack,
  credits,
  isGenerating,
  results,
  error,
  isLoggedIn = true,
  onShowPaywall,
  onGenerate,
  onDownload,
}) => {
  // === TAB STATE ===
  type StepTab = 'modelo' | 'pecas' | 'estilo' | 'config';
  const [activeTab, setActiveTab] = useState<StepTab>('modelo');

  // === MOBILE VIEW TOGGLE ===
  const [mobileView, setMobileView] = useState<'controls' | 'results'>('controls');

  // === MODEL STATE ===
  const [modelMode, setModelMode] = useState<'upload' | 'avatar'>('avatar');
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);

  // Avatar options
  const [avatarGender, setAvatarGender] = useState<'feminino' | 'masculino'>('feminino');
  const [selectedPreset, setSelectedPreset] = useState<AvatarPreset | null>(AVATAR_PRESETS[0]);

  // === PRODUCT PIECES STATE ===
  const [topImage, setTopImage] = useState<string | null>(null);
  const [topPreview, setTopPreview] = useState<string | null>(null);
  const [bottomImage, setBottomImage] = useState<string | null>(null);
  const [bottomPreview, setBottomPreview] = useState<string | null>(null);
  const [shoesImage, setShoesImage] = useState<string | null>(null);
  const [shoesPreview, setShoesPreview] = useState<string | null>(null);
  const [dressImage, setDressImage] = useState<string | null>(null);
  const [dressPreview, setDressPreview] = useState<string | null>(null);
  const [bagImage, setBagImage] = useState<string | null>(null);
  const [bagPreview, setBagPreview] = useState<string | null>(null);
  const [accessoryImage, setAccessoryImage] = useState<string | null>(null);
  const [accessoryPreview, setAccessoryPreview] = useState<string | null>(null);

  // Peça única vs Top+Bottom toggle
  const [pieceMode, setPieceMode] = useState<'separado' | 'unica'>('separado');

  // === STYLE & CONFIG ===
  const [selectedStyle, setSelectedStyle] = useState<string>('TikTok Viral');
  const [styleCategory, setStyleCategory] = useState<ModaStyleCategory>('popular');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT_4_5);
  const [designCount, setDesignCount] = useState(3);
  const [customInstructions, setCustomInstructions] = useState('');

  // Refs
  const modelInputRef = useRef<HTMLInputElement>(null);
  const topInputRef = useRef<HTMLInputElement>(null);
  const bottomInputRef = useRef<HTMLInputElement>(null);
  const shoesInputRef = useRef<HTMLInputElement>(null);
  const dressInputRef = useRef<HTMLInputElement>(null);
  const bagInputRef = useRef<HTMLInputElement>(null);
  const accessoryInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // === VIDEO STATE ===
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [videoStatus, setVideoStatus] = useState<string>('');
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [showVideoConfirm, setShowVideoConfirm] = useState(false);
  const pendingVideoImage = useRef<{ id: string; url: string } | null>(null);
  // Store request_ids AND fal.ai URLs to avoid re-submitting (and re-charging) on retry
  const [videoRequestIds, setVideoRequestIds] = useState<Record<string, string>>({});
  const [videoStatusUrls, setVideoStatusUrls] = useState<Record<string, string>>({});
  const [videoResponseUrls, setVideoResponseUrls] = useState<Record<string, string>>({});

  const askGenerateVideo = (imageId: string, imageUrl: string) => {
    pendingVideoImage.current = { id: imageId, url: imageUrl };
    setShowVideoConfirm(true);
  };

  const [videoError, setVideoError] = useState<Record<string, string>>({});

  const confirmGenerateVideo = async () => {
    const img = pendingVideoImage.current;
    if (!img) return;
    setShowVideoConfirm(false);
    pendingVideoImage.current = null;

    try {
      setAnimatingId(img.id);
      setVideoError(prev => { const n = { ...prev }; delete n[img.id]; return n; });

      // Check if we already have a request_id (retry scenario — don't re-submit)
      const existingRequestId = videoRequestIds[img.id];
      let requestId = existingRequestId;
      let sUrl = videoStatusUrls[img.id];
      let rUrl = videoResponseUrls[img.id];

      if (!requestId) {
        // First attempt — submit and deduct credits
        setVideoStatus('Fazendo upload da imagem...');
        setVideoProgress(5);

        const submitResult = await submitVideoGeneration(img.url);
        requestId = submitResult.request_id;
        sUrl = submitResult.status_url || '';
        rUrl = submitResult.response_url || '';

        // Store request_id AND URLs for potential retry
        setVideoRequestIds(prev => ({ ...prev, [img.id]: requestId! }));
        if (sUrl) setVideoStatusUrls(prev => ({ ...prev, [img.id]: sUrl! }));
        if (rUrl) setVideoResponseUrls(prev => ({ ...prev, [img.id]: rUrl! }));
      } else {
        // Retry — skip submit, just resume status polling (NO credit deduction)
        console.log('Retrying video with existing request_id:', requestId);
      }

      setVideoStatus('Gerando vídeo...');
      setVideoProgress(10);

      const videoUrl = await waitForVideo(
        requestId,
        (status, percent) => {
          setVideoStatus(status);
          setVideoProgress(percent);
        },
        480000, // 8 min max
        sUrl || undefined,
        rUrl || undefined,
      );

      setVideoUrls(prev => ({ ...prev, [img.id]: videoUrl }));
      // Clean up stored request_id on success
      setVideoRequestIds(prev => { const n = { ...prev }; delete n[img.id]; return n; });
      setVideoStatus('');
      setVideoProgress(0);
    } catch (err: any) {
      const msg = err.message || 'Erro ao gerar vídeo';
      setVideoError(prev => ({ ...prev, [img.id]: msg }));
      setVideoStatus('');
      setVideoProgress(0);
      // Don't auto-clear so user can retry
      // Keep the request_id stored so retry doesn't re-charge
    } finally {
      setAnimatingId(null);
    }
  };

  const filteredPresets = AVATAR_PRESETS.filter(p => p.gender === avatarGender);

  // Retry video without re-submitting (skips confirmation modal, reuses existing request_id)
  const confirmGenerateVideoRetry = (imageId: string, imageUrl: string) => {
    pendingVideoImage.current = { id: imageId, url: imageUrl };
    confirmGenerateVideo();
  };
  const filteredStyles = MODA_STYLES.filter(s => s.category === styleCategory);

  // Auto-scroll to results and auto-switch mobile view
  useEffect(() => {
    if (results.length > 0) {
      // On mobile, auto-switch to results view
      setMobileView('results');
      if (resultsRef.current) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, [results]);

  const handleFileUpload = useCallback(async (
    file: File,
    setBase64: (v: string | null) => void,
    setPreview: (v: string | null) => void,
  ) => {
    const preview = URL.createObjectURL(file);
    setPreview(preview);
    const base64 = await imageToBase64(file);
    setBase64(base64);
  }, []);

  const clearImage = (
    setBase64: (v: string | null) => void,
    setPreview: (v: string | null) => void,
  ) => {
    setBase64(null);
    setPreview(null);
  };

  const hasGarment = pieceMode === 'unica' ? !!dressImage : !!topImage;
  const isReady = hasGarment && (modelMode === 'avatar' || modelImage);

  const handleGenerate = () => {
    // If not logged in or no credits, show paywall
    if (!isLoggedIn || credits <= 0) {
      onShowPaywall?.();
      return;
    }

    const config: ModaGenerationConfig = {
      studioStyle: selectedStyle,
      aspectRatio,
      designCount,
      avatarGender,
      avatarAge: selectedPreset?.id.includes('teen') ? '14-17' 
        : selectedPreset?.id.includes('crianca') ? '5-10'
        : selectedPreset?.id.includes('madur') ? '50-65'
        : '25-35',
      useAvatar: modelMode === 'avatar',
      avatarPreset: selectedPreset ? selectedPreset.prompt : undefined,
      customInstructions: customInstructions || undefined,
    };

    onGenerate(
      config,
      modelImage,
      pieceMode === 'separado' ? topImage : null,
      pieceMode === 'separado' ? bottomImage : null,
      shoesImage,
      pieceMode === 'unica' ? dressImage : null,
      bagImage,
      accessoryImage
    );
  };

  // Upload card component
  const UploadCard = ({
    label, emoji, preview, onUpload, onClear, inputRef, required = false, hint
  }: {
    label: string; emoji: string; preview: string | null; onUpload: (file: File) => void;
    onClear: () => void; inputRef: React.RefObject<HTMLInputElement>; required?: boolean; hint: string;
  }) => (
    <div className={`relative rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
      preview ? 'border-rose-400 bg-rose-50/50' : 'border-gray-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
    }`}>
      {preview ? (
        <div className="relative aspect-square">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <button
            onClick={onClear}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="text-white text-[9px] font-bold">{emoji} {label}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-square flex flex-col items-center justify-center gap-1.5 p-3"
        >
          <span className="text-2xl">{emoji}</span>
          <p className="text-gray-700 text-[10px] font-bold">{label}</p>
          <p className="text-gray-400 text-[8px] text-center leading-tight">{hint}</p>
          {required && <span className="text-rose-400 text-[8px] font-black uppercase">Obrigatório</span>}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
    </div>
  );

  // Tab button component
  const TabButton = ({ tab, label, emoji, badge }: { tab: StepTab; label: string; emoji: string; badge?: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-2.5 px-2 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${
        activeTab === tab
          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg scale-[0.97]'
          : 'bg-white text-gray-500 hover:bg-rose-50 border border-gray-100'
      }`}
    >
      <span className="text-sm">{emoji}</span>
      <span>{label}</span>
      {badge && <span className={`text-[7px] px-1.5 py-0.5 rounded-full ${
        activeTab === tab ? 'bg-white/20' : 'bg-rose-100 text-rose-500'
      }`}>{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 30%, #FFF0F6 60%, #FFFFFF 100%)' }}>

      {/* HEADER */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-rose-100/60 shadow-sm z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={onNavigateBack} className="text-gray-400 hover:text-gray-600 text-xs">← Voltar</button>
            <div className="flex items-center gap-1.5">
              <img src="/logo-gold.png" alt="LumiphotoIA" className="h-5 md:h-7 w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] md:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">LUMI<span className="text-gray-800">IA</span></span>
                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.15em] text-rose-400">👗 Studio Moda</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400">{credits} créditos</span>
          </div>
        </div>
      </nav>

      {/* MOBILE VIEW TOGGLE */}
      {results.length > 0 && (
        <div className="md:hidden flex gap-1 px-3 pt-2 flex-shrink-0">
          <button
            onClick={() => setMobileView('controls')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mobileView === 'controls' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
          >
            ⚙️ Configurar
          </button>
          <button
            onClick={() => setMobileView('results')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mobileView === 'results' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
          >
            ✨ Resultados ({results.length})
          </button>
        </div>
      )}

      {/* MAIN CONTENT — Scrollable on mobile, fixed height on desktop */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 py-3 flex flex-col md:flex-row gap-4 overflow-visible md:overflow-hidden">

        {/* MOBILE FULLSCREEN LOADING OVERLAY */}
        {isGenerating && (
          <div className="fixed inset-0 z-[90] bg-gradient-to-b from-rose-50/95 to-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 md:hidden">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-rose-200 rounded-full" />
              <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-rose-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={28} className="text-rose-400 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-gray-800">Gerando seu Look...</h3>
              <p className="text-sm text-gray-500 max-w-xs">A IA está criando {designCount} {designCount === 1 ? 'foto' : 'fotos'} profissional{designCount > 1 ? 'is' : ''} de moda</p>
              <div className="flex items-center justify-center gap-1 pt-2">
                <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* ===== LEFT: CONTROLS (scrollable panel) ===== */}
        <div className={`w-full md:w-[340px] flex-shrink-0 flex flex-col gap-3 md:overflow-hidden ${mobileView === 'results' && results.length > 0 ? 'hidden md:flex' : 'flex'}`} style={{ minHeight: 'auto' }}>

          {/* TAB NAVIGATION */}
          <div className="flex gap-1.5 flex-shrink-0">
            <TabButton tab="modelo" label="Modelo" emoji="👤" badge={modelMode === 'avatar' && selectedPreset ? selectedPreset.emoji : undefined} />
            <TabButton tab="pecas" label="Peças" emoji="👗" badge={topImage ? '✓' : undefined} />
            <TabButton tab="estilo" label="Estilo" emoji="🎨" />
            <TabButton tab="config" label="Config" emoji="⚙️" />
          </div>

          {/* TAB CONTENT — Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-2xl bg-white border border-rose-100 shadow-sm md:max-h-none" style={{ maxHeight: 'calc(100vh - 280px)' }}>

            {/* === TAB: MODELO === */}
            {activeTab === 'modelo' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-rose-400" />
                  <span className="text-sm font-black text-gray-800 uppercase">Modelo</span>
                </div>

                {/* Toggle: Upload vs Avatar */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModelMode('upload')}
                    className={`py-2.5 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                      modelMode === 'upload'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-500 hover:bg-rose-50'
                    }`}
                  >
                    <Camera size={14} />
                    Subir Foto
                  </button>
                  <button
                    onClick={() => setModelMode('avatar')}
                    className={`py-2.5 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                      modelMode === 'avatar'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-500 hover:bg-rose-50'
                    }`}
                  >
                    <Sparkles size={14} />
                    Avatar IA
                  </button>
                </div>

                {modelMode === 'upload' ? (
                  <div className={`relative rounded-2xl border-2 border-dashed transition-all ${
                    modelPreview ? 'border-rose-400' : 'border-gray-200 hover:border-rose-300'
                  }`}>
                    {modelPreview ? (
                      <div className="relative aspect-[3/4]">
                        <img src={modelPreview} alt="Modelo" className="w-full h-full object-cover rounded-xl" />
                        <button onClick={() => clearImage(setModelImage, setModelPreview)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => modelInputRef.current?.click()}
                        className="w-full py-10 flex flex-col items-center gap-2"
                      >
                        <Camera size={28} className="text-rose-300" />
                        <p className="text-gray-600 text-xs font-bold">Subir foto da modelo</p>
                        <p className="text-gray-400 text-[10px]">A IA vai vestir as peças nela</p>
                      </button>
                    )}
                    <input
                      ref={modelInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, setModelImage, setModelPreview);
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Gender Toggle */}
                    <div className="grid grid-cols-2 gap-2">
                      {(['feminino', 'masculino'] as const).map(g => (
                        <button
                          key={g}
                          onClick={() => {
                            setAvatarGender(g);
                            const first = AVATAR_PRESETS.find(p => p.gender === g);
                            setSelectedPreset(first || null);
                          }}
                          className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                            avatarGender === g
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'bg-gray-50 text-gray-400 hover:bg-rose-50 border border-gray-100'
                          }`}
                        >
                          {g === 'feminino' ? '👩 Feminino' : '👨 Masculino'}
                        </button>
                      ))}
                    </div>

                    {/* Influencer Presets Grid */}
                    <p className="text-rose-500 text-[9px] font-black uppercase">✨ Escolha o tipo de modelo</p>
                    <div className="grid grid-cols-2 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
                      {filteredPresets.map(preset => (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedPreset(preset)}
                          className={`p-2.5 rounded-xl text-left transition-all ${
                            selectedPreset?.id === preset.id
                              ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg ring-2 ring-rose-300 ring-offset-1'
                              : 'bg-gray-50 hover:bg-rose-50 border border-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm">{preset.emoji}</span>
                            <span className={`text-[10px] font-bold leading-tight ${selectedPreset?.id === preset.id ? 'text-white' : 'text-gray-700'}`}>{preset.name}</span>
                          </div>
                          <p className={`text-[8px] leading-tight ${selectedPreset?.id === preset.id ? 'text-white/70' : 'text-gray-400'}`}>{preset.desc}</p>
                        </button>
                      ))}
                    </div>

                    {selectedPreset && (
                      <div className="text-center p-2 rounded-lg bg-pink-50 border border-pink-100">
                        <p className="text-[9px] text-pink-500 font-bold">✨ {selectedPreset.name}: {selectedPreset.desc}</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setActiveTab('pecas')}
                  className="w-full py-2 rounded-xl bg-rose-50 text-rose-500 text-[10px] font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-1"
                >
                  Próximo: Peças do Look <ChevronRight size={12} />
                </button>
              </div>
            )}

            {/* === TAB: PEÇAS === */}
            {activeTab === 'pecas' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Shirt size={16} className="text-rose-400" />
                  <span className="text-sm font-black text-gray-800 uppercase">Peças do Look</span>
                </div>

                {/* Toggle: Top+Bottom vs Peça Única */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPieceMode('separado')}
                    className={`py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                      pieceMode === 'separado'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-500 hover:bg-rose-50'
                    }`}
                  >
                    👕+👖 Top + Bottom
                  </button>
                  <button
                    onClick={() => setPieceMode('unica')}
                    className={`py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                      pieceMode === 'unica'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-500 hover:bg-rose-50'
                    }`}
                  >
                    👗 Peça Única
                  </button>
                </div>

                {/* ROUPAS */}
                <div className="space-y-2">
                  <p className="text-rose-500 text-[9px] font-black uppercase">👗 Roupas</p>
                  {pieceMode === 'separado' ? (
                    <div className="grid grid-cols-3 gap-2">
                      <UploadCard
                        label="Top" emoji="👕" hint="Camiseta, blusa ou jaqueta"
                        preview={topPreview} required={true}
                        inputRef={topInputRef as React.RefObject<HTMLInputElement>}
                        onUpload={(file) => handleFileUpload(file, setTopImage, setTopPreview)}
                        onClear={() => clearImage(setTopImage, setTopPreview)}
                      />
                      <UploadCard
                        label="Bottom" emoji="👖" hint="Calça, saia ou short"
                        preview={bottomPreview}
                        inputRef={bottomInputRef as React.RefObject<HTMLInputElement>}
                        onUpload={(file) => handleFileUpload(file, setBottomImage, setBottomPreview)}
                        onClear={() => clearImage(setBottomImage, setBottomPreview)}
                      />
                      <UploadCard
                        label="Calçados" emoji="👟" hint="Tênis, salto ou bota"
                        preview={shoesPreview}
                        inputRef={shoesInputRef as React.RefObject<HTMLInputElement>}
                        onUpload={(file) => handleFileUpload(file, setShoesImage, setShoesPreview)}
                        onClear={() => clearImage(setShoesImage, setShoesPreview)}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <UploadCard
                        label="Peça Única" emoji="👗" hint="Vestido, macacão, jardineira"
                        preview={dressPreview} required={true}
                        inputRef={dressInputRef as React.RefObject<HTMLInputElement>}
                        onUpload={(file) => handleFileUpload(file, setDressImage, setDressPreview)}
                        onClear={() => clearImage(setDressImage, setDressPreview)}
                      />
                      <UploadCard
                        label="Calçados" emoji="👟" hint="Tênis, salto ou bota"
                        preview={shoesPreview}
                        inputRef={shoesInputRef as React.RefObject<HTMLInputElement>}
                        onUpload={(file) => handleFileUpload(file, setShoesImage, setShoesPreview)}
                        onClear={() => clearImage(setShoesImage, setShoesPreview)}
                      />
                    </div>
                  )}
                </div>

                {/* ACESSÓRIOS */}
                <div className="space-y-2">
                  <p className="text-rose-500 text-[9px] font-black uppercase">💎 Acessórios (opcional)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <UploadCard
                      label="Bolsa" emoji="👜" hint="Bolsa, clutch ou mochila"
                      preview={bagPreview}
                      inputRef={bagInputRef as React.RefObject<HTMLInputElement>}
                      onUpload={(file) => handleFileUpload(file, setBagImage, setBagPreview)}
                      onClear={() => clearImage(setBagImage, setBagPreview)}
                    />
                    <UploadCard
                      label="Acessório" emoji="💍" hint="Colar, brinco, anel, óculos, chapéu..."
                      preview={accessoryPreview}
                      inputRef={accessoryInputRef as React.RefObject<HTMLInputElement>}
                      onUpload={(file) => handleFileUpload(file, setAccessoryImage, setAccessoryPreview)}
                      onClear={() => clearImage(setAccessoryImage, setAccessoryPreview)}
                    />
                  </div>
                </div>

                {hasGarment && (
                  <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-center">
                    <p className="text-[9px] text-green-600 font-bold">
                      ✅ {pieceMode === 'unica' ? 'Peça única' : 'Top'} adicionado!
                      {pieceMode === 'separado' && bottomImage ? ' ✅ Bottom' : ''}
                      {shoesImage ? ' ✅ Calçados' : ''}
                      {bagImage ? ' ✅ Bolsa' : ''}
                      {accessoryImage ? ' ✅ Acessório' : ''}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setActiveTab('estilo')}
                  className="w-full py-2 rounded-xl bg-rose-50 text-rose-500 text-[10px] font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-1"
                >
                  Próximo: Estilo <ChevronRight size={12} />
                </button>
              </div>
            )}

            {/* === TAB: ESTILO === */}
            {activeTab === 'estilo' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={16} className="text-rose-400" />
                  <span className="text-sm font-black text-gray-800 uppercase">Estilo da Foto</span>
                </div>

                {/* Style Category Filter */}
                <div className="flex gap-1">
                  {STYLE_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setStyleCategory(cat.id)}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                        styleCategory === cat.id
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-gray-50 text-gray-400 hover:bg-rose-50'
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Style Grid — with thumbnails */}
                <div className="grid grid-cols-2 gap-2">
                  {filteredStyles.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={`relative rounded-xl overflow-hidden transition-all group ${
                        selectedStyle === s.id
                          ? 'ring-3 ring-rose-500 ring-offset-1 shadow-lg scale-[0.98]'
                          : 'border border-gray-100 hover:border-rose-300 hover:shadow-md'
                      }`}
                    >
                      {/* Thumbnail Image */}
                      <div className="aspect-[4/3] relative">
                        <img
                          src={s.thumb}
                          alt={s.label}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className={`absolute inset-0 ${
                          selectedStyle === s.id
                            ? 'bg-gradient-to-t from-rose-600/80 via-rose-500/30 to-transparent'
                            : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
                        }`} />
                        {/* Selected checkmark */}
                        {selectedStyle === s.id && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shadow-md">
                            <span className="text-white text-[10px] font-black">✓</span>
                          </div>
                        )}
                        {/* Label overlay */}
                        <div className="absolute bottom-0 inset-x-0 p-2">
                          <p className="text-white text-[10px] font-bold leading-tight drop-shadow-md">{s.label}</p>
                          <p className="text-white/70 text-[8px] leading-tight drop-shadow-sm">{s.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('config')}
                  className="w-full py-2 rounded-xl bg-rose-50 text-rose-500 text-[10px] font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-1"
                >
                  Próximo: Configurações <ChevronRight size={12} />
                </button>
              </div>
            )}

            {/* === TAB: CONFIG === */}
            {activeTab === 'config' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">⚙️</span>
                  <span className="text-sm font-black text-gray-800 uppercase">Configurações</span>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">📐 Proporção</p>
                  <div className="grid grid-cols-4 gap-2">
                    {ASPECT_RATIOS.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setAspectRatio(r.value)}
                        className={`py-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-0.5 transition-all ${
                          aspectRatio === r.value
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-gray-50 text-gray-400 hover:bg-rose-50'
                        }`}
                      >
                        <span>{r.icon}</span>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Count */}
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">🖼️ Quantidade</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(c => (
                      <button
                        key={c}
                        onClick={() => setDesignCount(c)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                          designCount === c
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-gray-50 text-gray-400 hover:bg-rose-50'
                        }`}
                      >
                        {c} {c === 1 ? 'foto' : 'fotos'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Instructions */}
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">✏️ Instruções extras (opcional)</p>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Ex: foto em fundo de praia, luz dourada do pôr do sol..."
                    className="w-full py-2.5 px-3 text-xs text-gray-800 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 focus:outline-none bg-gray-50 resize-none placeholder:text-gray-300"
                    rows={2}
                  />
                </div>

                {/* Summary before generating */}
                <div className="rounded-xl bg-rose-50/50 border border-rose-100 p-3 space-y-1.5">
                  <p className="text-[9px] font-black uppercase text-rose-400">📋 Resumo</p>
                  <div className="text-[10px] text-gray-600 space-y-0.5">
                    <p>👤 <b>Modelo:</b> {modelMode === 'avatar' ? (selectedPreset?.name || 'Avatar IA') : 'Foto enviada'}</p>
                    <p>👗 <b>Peças:</b> {[
                      pieceMode === 'unica' && dressImage && 'Peça Única',
                      pieceMode === 'separado' && topImage && 'Top',
                      pieceMode === 'separado' && bottomImage && 'Bottom',
                      shoesImage && 'Calçados',
                      bagImage && 'Bolsa',
                      accessoryImage && 'Acessório'
                    ].filter(Boolean).join(', ') || 'Nenhuma'}</p>
                    <p>🎨 <b>Estilo:</b> {selectedStyle}</p>
                    <p>📐 <b>Formato:</b> {ASPECT_RATIOS.find(r => r.value === aspectRatio)?.label} • {designCount} {designCount === 1 ? 'foto' : 'fotos'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GENERATE BUTTON — Always visible at bottom, sticky on mobile */}
          <div className="flex-shrink-0 space-y-2 sticky bottom-0 bg-gradient-to-t from-[#FFF5F5] via-[#FFF5F5] to-transparent pt-3 pb-2 -mx-0 px-0 z-20">
            <button
              onClick={handleGenerate}
              disabled={!isReady || isGenerating}
              className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                isReady && !isGenerating
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_8px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_8px_40px_rgba(244,63,94,0.5)] hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando Look...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Gerar Look ({designCount} {designCount === 1 ? 'foto' : 'fotos'} • {designCount} {designCount === 1 ? 'crédito' : 'créditos'})
                </>
              )}
            </button>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold text-center">
                ❌ {error}
              </div>
            )}

            {!isReady && (
              <p className="text-center text-[9px] text-gray-400">
                {!hasGarment ? (pieceMode === 'unica' ? '👗 Suba a foto da peça única para começar' : '👕 Suba a foto do top para começar') : '📸 Suba foto da modelo ou use avatar IA'}
              </p>
            )}
          </div>
        </div>

        {/* ===== RIGHT: RESULTS (scrollable) ===== */}
        <div ref={resultsRef} className={`flex-1 overflow-y-auto rounded-2xl ${mobileView === 'controls' && results.length > 0 ? 'hidden md:block' : 'block'}`}>
          {results.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm p-3 rounded-xl z-10">
                <h3 className="text-sm font-black text-gray-800 uppercase flex items-center gap-2">
                  <Star size={16} className="text-rose-400" />
                  Resultado
                </h3>
                <span className="text-[10px] text-gray-400">{results.length} {results.length === 1 ? 'look' : 'looks'} gerados</span>
              </div>
              <div className={`grid gap-3 px-1 ${results.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : results.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                {results.map((result, i) => (
                  <div key={result.id} className="relative rounded-2xl overflow-hidden border border-rose-100 shadow-lg group bg-white">
                    <img
                      src={result.url}
                      alt={`Look ${i + 1}`}
                      className="w-full object-cover"
                    />

                    {/* Video progress overlay */}
                    {animatingId === result.id && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 z-20">
                        <Loader2 className="animate-spin text-rose-400" size={32} />
                        <p className="text-white text-xs font-bold">{videoStatus || 'Processando...'}</p>
                        <div className="w-3/4 bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                        <p className="text-white/60 text-[9px]">{Math.round(videoProgress)}%</p>
                      </div>
                    )}

                    {/* Video player */}
                    {videoUrls[result.id] && (
                      <div className="mt-0">
                        <video
                          src={videoUrls[result.id]}
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Always-visible action buttons below photo */}
                    <div className="p-2.5 bg-white border-t border-rose-100 space-y-2">
                      <div className="flex items-center gap-1.5">
                        {!videoUrls[result.id] && animatingId !== result.id && (
                          <button
                            onClick={() => askGenerateVideo(result.id, result.url)}
                            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 hover:shadow-lg active:scale-95 transition-all"
                          >
                            <Film size={13} /> Gerar Vídeo
                          </button>
                        )}
                        {animatingId === result.id && (
                          <div className="flex-1 py-2 rounded-xl bg-purple-100 text-purple-600 text-[10px] font-bold flex items-center justify-center gap-1.5">
                            <Loader2 size={13} className="animate-spin" /> Gerando...
                          </div>
                        )}
                        {videoUrls[result.id] && (
                          <button
                            onClick={() => {
                              const videoUrl = videoUrls[result.id];
                              const fileName = `moda-video-${Date.now()}.mp4`;
                              const xhr = new XMLHttpRequest();
                              xhr.open('GET', videoUrl, true);
                              xhr.responseType = 'blob';
                              xhr.onload = function() {
                                if (xhr.status === 200) {
                                  const blob = xhr.response;
                                  const blobUrl = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = blobUrl;
                                  a.download = fileName;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
                                } else {
                                  // Fallback: navigate to URL
                                  const a = document.createElement('a');
                                  a.href = videoUrl;
                                  a.download = fileName;
                                  a.target = '_blank';
                                  a.click();
                                }
                              };
                              xhr.onerror = function() {
                                const a = document.createElement('a');
                                a.href = videoUrl;
                                a.download = fileName;
                                a.target = '_blank';
                                a.click();
                              };
                              xhr.send();
                            }}
                            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 hover:shadow-lg active:scale-95 transition-all"
                          >
                            <Download size={13} /> Baixar Vídeo
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const url = result.url;
                            const fileName = `moda-look-${i + 1}-${Date.now()}.png`;
                            
                            // Handle data URLs directly (most common case for generated images)
                            if (url.startsWith('data:')) {
                              // Convert data URL to blob
                              const parts = url.split(',');
                              const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
                              const byteString = atob(parts[1]);
                              const ab = new ArrayBuffer(byteString.length);
                              const ia = new Uint8Array(ab);
                              for (let j = 0; j < byteString.length; j++) {
                                ia[j] = byteString.charCodeAt(j);
                              }
                              const blob = new Blob([ab], { type: mime });
                              const blobUrl = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = blobUrl;
                              a.download = fileName;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
                            } else {
                              // External URL — try XHR
                              const xhr = new XMLHttpRequest();
                              xhr.open('GET', url, true);
                              xhr.responseType = 'blob';
                              xhr.onload = function() {
                                if (xhr.status === 200) {
                                  const blob = xhr.response;
                                  const blobUrl = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = blobUrl;
                                  a.download = fileName;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
                                } else {
                                  // Fallback: let onDownload handle it
                                  if (onDownload) onDownload(url);
                                }
                              };
                              xhr.onerror = function() {
                                if (onDownload) onDownload(url);
                              };
                              xhr.send();
                            }
                          }}
                          className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-rose-100 active:scale-95 transition-all"
                        >
                          <Download size={13} /> Baixar Foto
                        </button>
                      </div>
                      {videoError[result.id] && (
                        <div className="flex items-start gap-1.5 p-2 rounded-lg bg-red-50 border border-red-200">
                          <span className="text-red-500 text-[10px] font-bold flex-1">⚠️ {videoError[result.id]}</span>
                          <button
                            onClick={() => { setVideoError(prev => { const n = { ...prev }; delete n[result.id]; return n; }); confirmGenerateVideoRetry(result.id, result.url); }}
                            className="text-[9px] font-bold text-red-600 underline whitespace-nowrap"
                          >
                            Tentar de novo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full rounded-2xl border-2 border-dashed border-gray-200 bg-white/50">
              <div className="text-center space-y-4 p-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 flex items-center justify-center">
                  <ShoppingBag size={32} className="text-rose-300" />
                </div>
                <div>
                  <h3 className="text-gray-700 font-bold text-base mb-2">Seu look aparecerá aqui</h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Escolha a modelo, suba as peças, defina o estilo e clique em <strong>Gerar Look</strong> para criar fotos profissionais de moda.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">👤 Modelo</span>
                  <span>+</span>
                  <span className="flex items-center gap-1">👕 Peças</span>
                  <span>+</span>
                  <span className="flex items-center gap-1">🎨 Estilo</span>
                  <span>=</span>
                  <span className="flex items-center gap-1 text-rose-400 font-bold">✨ Look profissional</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
      {/* VIDEO CONFIRMATION MODAL */}
      {showVideoConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowVideoConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="text-gray-800 font-black text-base mb-2">Gerar Vídeo</h3>
            <p className="text-gray-500 text-sm mb-1">
              Transformar esta foto em um vídeo de moda com IA?
            </p>
            <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 mb-3">
              <p className="text-purple-600 text-[10px] font-bold flex items-center justify-center gap-1">
                ⚡ Cada vídeo consome <strong>5 créditos</strong> do seu saldo
              </p>
            </div>
            <p className="text-gray-400 text-[10px] mb-4">
              O vídeo leva cerca de 2 minutos para ficar pronto.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowVideoConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmGenerateVideo}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1"
              >
                <Film size={14} /> Gerar Vídeo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ModaStudioPage;
