
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Palette,
  Image as ImageIcon,
  Upload,
  Loader2,
  AlertCircle,
  Users,
  Edit3,
  Layout,
  X,
  Eye,
  Type as TypeIcon,
  Layers,
  Sparkles,
  Settings,
  Cpu,
  Monitor,
  Zap,
  Box,
  Sliders,
  Activity,
  ArrowRight,
  Download,
  Camera,
  Play,
  FileText,
  Target,
  UserCheck,
  ImagePlus,
  Flame,
  Star,
  Maximize2,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Type,
  Key,
  Image as ImageLucide,
  Plus,
  Check,
  ChevronLeft,
  User,
  ShoppingBag,
  Sticker,
  Move,
  ExternalLink,
  Folder,
  Save,
  Smile,
  Film,
  LogOut,
  Package,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Smartphone,
  Home
} from 'lucide-react';
import { CreationType, VisualStyle, StudioStyle, StudioStyleMeta, MascotStyle, MascotStyleMeta, MockupStyle, MockupStyleMeta, AspectRatio, SocialClass, GenerationConfig, GeneratedImage, ColorPalette, UGCEnvironment, UGCModel } from './types';
import { generateStudioCreative, editGeneratedImage, animateGeneratedImage } from './services/geminiService';
import { generatePPTX } from './services/pptService';
import { translations, Language } from './translations';
import { TextEditor } from './components/TextEditor';

import { AuthScreen } from './components/AuthScreen';
import { CheckoutPage } from './components/CheckoutPage';
import { CheckoutSuccess } from './components/CheckoutSuccess';
import { SalesPage } from './components/SalesPage';
import { jsPDF } from 'jspdf';
import { saveProject, canCreateProject, getRemainingSlots, getLastPurchaseDate, Project } from './services/projectService';
import { supabase } from './services/supabaseClient';

const ADMIN_EMAIL = 'talitafpublicitaria@gmail.com';

const App: React.FC = () => {
  const initialConfig: GenerationConfig = {
    type: CreationType.STUDIO_PHOTO,
    style: VisualStyle.MODERN,
    studioStyle: StudioStyle.EXECUTIVO_PRO,
    mascotStyle: MascotStyle.PIXAR_3D,
    aspectRatio: AspectRatio.SQUARE,
    productDescription: '',
    copyText: '',
    ctaText: '',
    targetAudience: '',
    socialClass: SocialClass.MIDDLE,
    designCount: 3,
    slideCount: 3,
    useAiAvatar: true,
    isEditableMode: false,
    ugcEnvironment: UGCEnvironment.HOME
  };

  const [config, setConfig] = useState<GenerationConfig>(initialConfig);
  const [language, setLanguage] = useState<Language>('pt');
  const t = translations[language];

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [studioRefImage, setStudioRefImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [environmentImage, setEnvironmentImage] = useState<string | null>(null); // New: Environment Background
  const [customModelImage, setCustomModelImage] = useState<string | null>(null);
  const [stickerImage, setStickerImage] = useState<string | null>(null);
  const [isEditableMode, setIsEditableMode] = useState<boolean>(false);

  // Text Editor State
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 }); // Percentage
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);

  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [credits, setCredits] = useState<number>(0);
  const [lastPurchaseDate, setLastPurchaseDate] = useState<string | null>(null);

  const [activePulseStep, setActivePulseStep] = useState<number | null>(null);
  const [showRatioSelector, setShowRatioSelector] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Profissional');
  const [isStep01Collapsed, setIsStep01Collapsed] = useState(false);

  // Avatar IA toggle - when true, generate AI avatar instead of using uploaded photo
  const [useAiAvatar, setUseAiAvatar] = useState(false);

  // New State for Sales Page Routing
  const [showAuth, setShowAuth] = useState(false);
  const [showSalesPage, setShowSalesPage] = useState(true);

  const categories = React.useMemo(() => {
    const cats = new Set(Object.values(StudioStyleMeta).map(m => m.category));
    const catArray = Array.from(cats);
    const order = ['Profissional', 'Moda & Beleza', 'Casual', 'Família', 'Aniversário', 'Comercial', 'Criativo'];
    return catArray.sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, []);

  const getTranslatedCategory = (cat: string) => {
    const mapping: Record<string, string> = {
      'Profissional': t.studio.categories.professional,
      'Moda & Beleza': t.studio.categories.fashion,
      'Casual': t.studio.categories.fitness,
      'Família': t.studio.categories.family,
      'Comercial': t.studio.categories.commercial,
      'Criativo': t.studio.categories.artistic
    };
    return mapping[cat] || cat;
  };

  const [showPaywall, setShowPaywall] = useState(false);

  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [activeVideos, setActiveVideos] = useState<Record<string, boolean>>({});

  // AUTH STATE
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // PERSISTENCE STATE
  const [persistentLayers, setPersistentLayers] = useState<Record<string, any[]>>({});

  // API KEY - always use admin key from env
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;

  // Mobile sidebar state
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      setIsStep01Collapsed(true);
    }
  }, [results]);

  useEffect(() => {
    // Check current session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user?.user_metadata?.credits) {
        setCredits(session.user.user_metadata.credits);
      }
      if (session?.user) {
        setShowSalesPage(false);
      }
      setAuthLoading(false);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user?.user_metadata?.credits) {
        setCredits(session.user.user_metadata.credits);
      }
      if (session?.user) {
        setShowSalesPage(false);
      } else {
        setShowSalesPage(true);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = () => {
    setConfig(initialConfig);
    setUploadedImage(null);
    setStudioRefImage(null);
    setProductImage(null);
    setCustomModelImage(null);
    setStickerImage(null);
    setResults([]);
    setError(null);
    setIsQuotaError(false);
    setSelectedImage(null);
    setActivePulseStep(null);
    setShowRatioSelector(true);
    setIsStep01Collapsed(false);
    setIsEditableMode(false);
  };





  const getTypeIcon = (type: CreationType) => {
    switch (type) {
      case CreationType.SOCIAL_POST: return <ImageIcon size={20} className="text-pink-400" />;
      case CreationType.YOUTUBE_THUMB: return <Play size={20} className="text-red-400" />;

      case CreationType.STUDIO_PHOTO: return <Camera size={20} className="text-purple-400" />;
      case CreationType.MASCOT: return <Smile size={20} className="text-orange-400" />;
      case CreationType.MOCKUP: return <Box size={20} className="text-emerald-400" />;
      case CreationType.MOCKUP: return <Box size={20} className="text-emerald-400" />;
      case CreationType.CREATIVE_BACKGROUND: return <Layout size={20} className="text-cyan-400" />;
      default: return <Sparkles size={20} className="text-indigo-400" />;
    }
  };

  const handleTypeChange = (type: CreationType) => {
    let newRatio = AspectRatio.SQUARE;
    if (type === CreationType.YOUTUBE_THUMB) {
      newRatio = AspectRatio.LANDSCAPE_16_9;
    } else {
      switch (type) {
        case CreationType.SOCIAL_POST: newRatio = AspectRatio.STORY_9_16; break;

        case CreationType.STUDIO_PHOTO: newRatio = AspectRatio.CLASSIC_4_3; break;
        case CreationType.MOCKUP: newRatio = AspectRatio.PORTRAIT_3_4; break;
        case CreationType.CREATIVE_BACKGROUND: newRatio = AspectRatio.LANDSCAPE_16_9; break;
      }
    }
    setConfig(prev => ({ ...prev, type, aspectRatio: newRatio }));
    setShowRatioSelector(true);
    setActivePulseStep(2);
  };

  const processFileToPNG = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'subject' | 'reference' | 'product' | 'sticker' | 'customModel' | 'environment') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const pngDataUrl = await processFileToPNG(file);

        if (field === 'subject') {
          setUploadedImage(pngDataUrl);
          setConfig(prev => ({ ...prev, useAiAvatar: false }));
        }
        if (field === 'reference') setStudioRefImage(pngDataUrl);
        if (field === 'product') setProductImage(pngDataUrl);
        if (field === 'environment') setEnvironmentImage(pngDataUrl); // Support environment upload
        if (field === 'customModel') setCustomModelImage(pngDataUrl);
        if (field === 'sticker') setStickerImage(pngDataUrl);
        setError(null);
        setIsQuotaError(false);
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Erro ao processar imagem. Tente outro arquivo.");
      }
    }
  };

  const handleLayerUpdate = useCallback((layers: any[]) => {
    setPersistentLayers(prev => {
      if (!editingImage) return prev;
      return { ...prev, [editingImage.id]: layers };
    });
  }, [editingImage]);


  const handleGenerate = async () => {
    if (!config.productDescription && !uploadedImage && !productImage && !config.copyText && !config.useAiAvatar && !environmentImage) {
      setError("Briefing incompleto: descreva o objetivo ou insira o texto da arte.");
      return;
    }

    if (!apiKey && credits <= 0) {
      // If no API key AND no credits, show paywall
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);
    // CLEAR PERSISTENCE
    setPersistentLayers({});
    setError(null);
    setIsQuotaError(false);
    setResults([]);
    setSelectedImage(null);
    setActivePulseStep(null);
    try {
      const generated = await generateStudioCreative({
        ...config,
        designCount: isCreativeBackground ? 6 : config.designCount, // FORCE 6 SLIDES FOR PPT
        isEditableMode
      }, uploadedImage, studioRefImage, productImage, stickerImage, customModelImage, environmentImage, apiKey || undefined);

      // Inject Layout Mode Metadata
      const resultsWithMeta = generated.map(img => ({
        ...img,
        layoutMode: config.useBoxLayout ? 'box' : 'default' as 'box' | 'default'
      }));

      setResults(resultsWithMeta);
    } catch (err: any) {
      console.error("Critical Generation Error:", err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setError("Erro de configuração: chave API inválida. Contate o suporte.");
        setIsGenerating(false);
        return;
      }
      const isQuota = err.message?.includes('429') || err.message?.includes('quota');
      setIsQuotaError(isQuota);
      setError(isQuota
        ? "Limite de Uso Atingido. A conta compartilhada atingiu o limite. Conecte sua prÃ³pria chave API para continuar."
        : (err.message || "Erro desconhecido na engine neural. Tente novamente.")
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshVariation = async (variationId: string) => {
    if (!apiKey) {
      setError("Chave API não configurada. Contate o suporte.");
      return;
    }

    setRefreshingId(variationId);
    setError(null);
    setIsQuotaError(false);

    try {
      const singleVariation = await generateStudioCreative(config, uploadedImage, studioRefImage, productImage, stickerImage, customModelImage, environmentImage, apiKey || undefined);
      const newImage = singleVariation[0];
      setResults(prev => prev.map(res =>
        res.id === variationId ? { ...res, url: newImage.url } : res
      ));
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setError("Erro de configuração: chave API inválida. Contate o suporte.");
        setRefreshingId(null);
        return;
      }
      const isQuota = err.message?.includes('429') || err.message?.includes('quota');
      setIsQuotaError(isQuota);
      setError(isQuota
        ? "Cota Excedida. Use sua chave API prÃ³pria para prioridade."
        : (err.message || "Erro ao atualizar esta variaÃ§Ã£o.")
      );
    } finally {
      setRefreshingId(null);
    }
  };

  const handleUpdateImage = (editedUrl: string, backgroundCleanUrl?: string) => {
    if (editingImage) {
      setResults(prev => prev.map(res =>
        res.id === editingImage.id ? {
          ...res,
          url: editedUrl,
          // Update clean background if provided (Magic Edit), else keep existing clean background
          originalUrl: backgroundCleanUrl || res.originalUrl || res.url
        } : res
      ));
      if (selectedImage?.id === editingImage.id) {
        setSelectedImage(prev => prev ? { ...prev, url: editedUrl } : null);
      }
      setEditingImage(null);
    }
  };

  const handleAnimateMockup = async (image: GeneratedImage) => {
    // Check quota/key (Mock check)
    // Check quota/key (Mock check)
    if (!apiKey) {
      setError("Chave API não configurada. Contate o suporte.");
      return;
    }

    // Toggle the video preview on
    setActiveVideos(prev => ({ ...prev, [image.id]: true }));

    // Scroll to the preview
    setTimeout(() => {
      document.getElementById(`video-${image.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // ... (keeping other functions)

  // IN THE RENDER LOOP (Replace the button area and add preview)


  // Exports the image as a PDF that can be opened in Canva with editable layers
  const exportToPDF = async (image: GeneratedImage) => {
    try {
      // Determine PDF dimensions based on aspect ratio (in mm)
      let pdfWidth = 210; // A4 width
      let pdfHeight = 210; // Square default
      let orientation: 'portrait' | 'landscape' = 'portrait';

      switch (config.aspectRatio) {
        case AspectRatio.SQUARE: // 1:1
          pdfWidth = 200;
          pdfHeight = 200;
          break;
        case AspectRatio.PORTRAIT_3_4: // 3:4
          pdfWidth = 150;
          pdfHeight = 200;
          break;
        case AspectRatio.STORY_9_16: // 9:16
          pdfWidth = 112.5;
          pdfHeight = 200;
          break;
        case AspectRatio.LANDSCAPE_16_9: // 16:9
          pdfWidth = 200;
          pdfHeight = 112.5;
          orientation = 'landscape';
          break;
      }

      // Create PDF with custom dimensions
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      // Use originalUrl (clean background without baked text) if available, otherwise use current url
      const backgroundUrl = image.originalUrl || image.url;
      pdf.addImage(backgroundUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Add text layers from persistentLayers as editable PDF text
      let layers = persistentLayers[image.id] || [];

      // If no layers but copyText exists, create a default text layer
      if (layers.length === 0 && config.copyText) {
        layers = [{
          type: 'text',
          text: config.copyText,
          position: { x: 50, y: 50 },
          fontSize: 48,
          color: '#ffffff',
          fontFamily: 'Inter',
          textAlign: 'center',
          maxWidth: 80
        }];
      }

      layers.forEach((layer: any) => {
        if (layer.type === 'text' && layer.text) {
          // Convert percentage position to mm
          const xMm = (layer.position.x / 100) * pdfWidth;
          const yMm = (layer.position.y / 100) * pdfHeight;

          // Set font size (convert from px approximation to pt)
          const fontSizePt = Math.round((layer.fontSize || 48) * 0.35);
          pdf.setFontSize(fontSizePt);

          // Set text color
          if (layer.color) {
            // Parse hex color to RGB
            const hex = layer.color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            pdf.setTextColor(r, g, b);
          } else {
            pdf.setTextColor(255, 255, 255);
          }

          // Add text with center alignment
          pdf.text(layer.text, xMm, yMm, { align: 'center' });
        }
      });

      // Download the PDF
      pdf.save(`lumiphotoia-studio-v${image.variation || 1}.pdf`);
      // Show instructions
      alert('PDF com camadas editÃ¡veis baixado!\\n\\n1. Abra o Canva â†’ Criar design â†’ Importar arquivo\\n2. Selecione o PDF baixado\\n3. Os textos serÃ£o camadas editÃ¡veis no Canva!');

      // Also open Canva
      window.open('https://www.canva.com/', '_blank');

    } catch (err: any) { // Changed 'error' to 'err: any' for consistency and type safety
      console.error('PDF Export failed:', err); // Changed message
      alert('Erro ao gerar PDF. Tente novamente.'); // Kept original alert message
    }
  };

  const handleDownloadPPT = async () => {
    if (results.length === 0) return;

    try {
      const slides = results.map(img => {
        // Map variation index to PPT Slide Type
        // 1=Cover, 2=Agenda, 3=Section, 4=Content, 5=Data, 6=End
        const v = img.variation || 1;
        let type: 'COVER' | 'AGENDA' | 'SECTION' | 'CONTENT_RIGHT' | 'DATA' | 'THANK_YOU' = 'CONTENT_RIGHT';

        if (v === 1) type = 'COVER';
        else if (v === 2) type = 'AGENDA';
        else if (v === 3) type = 'SECTION';
        else if (v === 4) type = 'CONTENT_RIGHT';
        else if (v === 5) type = 'DATA';
        else if (v === 6) type = 'THANK_YOU';

        return {
          imageUrl: img.url,
          type: type
        };
      });

      await generatePPTX(slides, "Tema_Corporativo_IA");
    } catch (err) {
      console.error("PPT Gen Error:", err);
      alert("Erro ao gerar PowerPoint.");
    }
  };

  // Opens Canva editor directly with the correct dimensions
  const openInCanva = () => {
    if (selectedImage) {
      exportToPDF(selectedImage);
    } else {
      // Fallback: just open Canva
      window.open('https://www.canva.com/', '_blank');
    }
  };

  const downloadImageDirectly = (url: string, variationIndex?: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `lumiphotoia-studio-v${variationIndex || 1}.png`;
    link.click();
  };

  const downloadPreview = (image: GeneratedImage) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous"; // Allow cross-origin if needed

    img.onload = () => {
      // 1. Resize for Low Res (Max 800px width)
      const maxWidth = 800;
      const scale = maxWidth / img.width;
      const width = maxWidth;
      const height = img.height * scale;

      canvas.width = width;
      canvas.height = height;

      if (!ctx) return;

      // 2. Draw Image
      ctx.drawImage(img, 0, 0, width, height);

      // 3. Add Watermark
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI / 4); // Diagonal
      ctx.font = "bold 48px Inter, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((t.main as any).preview_watermark || "PRÃ‰VIA - LUMIPHOTOIA", 0, 0);

      // Repeat watermark for better coverage
      ctx.font = "bold 24px Inter, sans-serif";
      ctx.fillText((t.main as any).preview_watermark || "PRÃ‰VIA", 0, -100);
      ctx.fillText((t.main as any).preview_watermark || "PRÃ‰VIA", 0, 100);
      ctx.restore();

      // 4. Export and Download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Low quality JPEG
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `PREVIA_CLIENTE_v${image.variation}.jpg`;
      link.click();
    };

    img.src = image.url;
  };

  const isStudioMode = config.type === CreationType.STUDIO_PHOTO;
  const isMascotMode = config.type === CreationType.MASCOT;
  const isMockupMode = config.type === CreationType.MOCKUP;
  const isCreativeBackground = config.type === CreationType.CREATIVE_BACKGROUND;


  const isReady = (config.productDescription.length > 3 || uploadedImage || productImage || config.copyText!.length > 1 || config.useAiAvatar) ||
    (isMockupMode && uploadedImage) ||
    (isCreativeBackground && ((customModelImage || uploadedImage) && studioRefImage));


  const getAspectClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case AspectRatio.LANDSCAPE_16_9: return 'aspect-video';
      case AspectRatio.SQUARE: return 'aspect-square';
      case AspectRatio.STORY_9_16: return 'aspect-[9/16]';
      case AspectRatio.PORTRAIT_3_4: return 'aspect-[3/4]';
      case AspectRatio.CLASSIC_4_3: return 'aspect-[4/3]';
      default: return 'aspect-square';
    }
  };

  // SIMPLE URL-BASED ROUTING
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // CHECKOUT ROUTES (accessible without auth)
  if (currentPath === '/checkout') {
    return <CheckoutPage onBack={() => navigateTo('/')} />;
  }

  if (currentPath === '/checkout/success' || currentPath.includes('collection_status=approved')) {
    return <CheckoutSuccess onGoToLogin={() => navigateTo('/')} />;
  }

  if (currentPath === '/checkout/failure' || currentPath === '/checkout/pending') {
    return <CheckoutSuccess onGoToLogin={() => navigateTo('/')} />;
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show Sales Page or Login screen if not authenticated
  // Show Sales Page or Login screen (Controlled state)
  if (showSalesPage) {
    if (showAuth) {
      return <AuthScreen onLogin={() => { }} />;
    }
    return <SalesPage onGetStarted={() => setShowSalesPage(false)} onLogin={() => setShowAuth(true)} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden text-white/90 selection:bg-amber-500/40 bg-[#0a0a0a]">
      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#080808] sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo-gold.png" alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">LUMIPHOTO<span className="text-white">IA</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="p-2 hover:bg-white/10 rounded-lg text-white/60">
            {showMobileSidebar ? <X size={20} /> : <Sliders size={20} />}
          </button>
          <button onClick={() => setShowSalesPage(true)} className="p-2 hover:bg-white/10 rounded-lg text-white/60">
            <Home size={20} />
          </button>
          <button onClick={async () => { await supabase.auth.signOut(); setUser(null); }} className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {showMobileSidebar && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-[85vw] md:w-[340px] h-full flex-shrink-0 border-r border-white/5 bg-[#080808]/95 backdrop-blur-xl flex flex-col z-50 md:z-20 tech-corners transition-transform duration-300`}>
        <header className="hidden md:flex p-7 items-center justify-between border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo-gold.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">LUMIPHOTO<span className="text-white">IA</span></h1>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title={t.sidebar.reset_tooltip}
                className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all"
              >
                <RotateCw size={18} />
              </button>
              <button
                onClick={() => setShowSalesPage(true)}
                title="Página Inicial"
                className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all"
              >
                <Home size={18} />
              </button>

              <button
                onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
                title="Sair"
                className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-400 transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/30">
          <div className="flex items-center gap-3">
            <img src="/logo-gold.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-base font-black text-amber-400">ConfiguraÃ§Ãµes</span>
          </div>
          <button onClick={() => setShowMobileSidebar(false)} className="p-2 hover:bg-white/10 rounded-lg text-white/60">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 md:px-7 py-6 md:py-8 space-y-10 md:space-y-12 scrollbar-hide">
          <section className="space-y-6">
            <header className="flex items-center gap-5">
              <div className="space-y-0.5">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-yellow-400">
                  {isStudioMode ? t.sidebar.step02_studio_title : (isMascotMode ? t.sidebar.step02_mascot_title : (isMockupMode ? 'ESTILO DO MOCKUP' : (isCreativeBackground ? 'REFERÃŠNCIA VISUAL' : t.sidebar.step02_title)))}
                </h2>
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{t.sidebar.step02_subtitle}</p>
              </div>
            </header>


            {/* Show notice when reference image overrides presets */}
            {(studioRefImage && !isCreativeBackground) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 text-center">
                  âš¡ Imagem de referÃªncia ativa - presets desativados
                </p>
              </div>
            )}

            {/* NEW UPLOAD SECTION INSIDE STEP 02 */}
            <div className="w-full space-y-4 pt-2 pb-6">

              {/* Reference Warning */}
              {(studioRefImage && !isCreativeBackground) && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-400"><AlertCircle size={14} /></div>
                  <p className="text-[10px] text-amber-200/80 font-medium leading-tight">
                    <span className="font-bold text-amber-400 block mb-0.5">Estilo Personalizado Ativo</span>
                    Os presets abaixo foram desativados para usar sua referÃªncia visual.
                  </p>
                </div>
              )}

              <div className={`grid grid-cols-2 gap-3 ${isCreativeBackground ? 'hidden' : ''}`}>
                {/* UPLOAD DO USUÃRIO - APENAS SE FOR STUDIO MODE */}
                {isStudioMode && (
                  <>


                    {/* QUEM APARECE NA FOTO - Show when Avatar IA is enabled */}
                    {useAiAvatar && (
                      <div className="col-span-2 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-wider text-violet-400">Quem Aparece na Foto? (Modelo)</p>
                        <select
                          value={config.avatarType || 'woman_young'}
                          onChange={(e) => setConfig(prev => ({ ...prev, avatarType: e.target.value }))}
                          className="w-full p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:border-violet-500 outline-none"
                        >
                          <option value="woman_young">{t.studio.avatar_types.woman_young}</option>
                          <option value="woman_mature">{t.studio.avatar_types.woman_mature}</option>
                          <option value="man_young">{t.studio.avatar_types.man_young}</option>
                          <option value="man_mature">{t.studio.avatar_types.man_mature}</option>
                          <option value="child">{t.studio.avatar_types.child}</option>
                          <option value="teen">{t.studio.avatar_types.teen}</option>
                          <option value="senior">{t.studio.avatar_types.senior}</option>
                        </select>
                      </div>
                    )}

                    {/* 1. SUBJECT PHOTO - Hide if Avatar IA is enabled */}
                    {!useAiAvatar && (
                      <div className="relative group col-span-2">
                        <input type="file" id="sidebar-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'subject')} />
                        <label htmlFor="sidebar-upload" className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[140px] relative overflow-hidden ${uploadedImage ? 'bg-amber-600/10 border-amber-500/50' : 'bg-gradient-to-br from-white/5 to-white/10 border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]'}`}>
                          {uploadedImage ? (
                            <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                              <img src={uploadedImage} className="max-h-24 rounded-lg shadow-lg object-contain" />
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"><Check size={12} className="text-white" /></div>
                              <p className="mt-3 text-[10px] font-black uppercase text-amber-400 tracking-widest">Sua Foto Enviada</p>
                            </div>
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-3 text-amber-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]"><User size={24} /></div>
                              <p className="text-xs font-black uppercase tracking-widest text-white group-hover:text-amber-400 transition-colors">{t.studio.upload_subject}</p>
                              <p className="text-[9px] text-white/40 mt-1 text-center font-medium max-w-[150px] leading-tight">Clique para enviar sua selfie sem maquiagem</p>
                            </>
                          )}
                        </label>
                      </div>
                    )}

                    {/* 2. PRODUCT PHOTO */}
                    <div className="relative group">
                      <input type="file" id="sidebar-product-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'product')} />
                      <label htmlFor="sidebar-product-upload" className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer h-32 ${productImage ? 'bg-emerald-600/10 border-emerald-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                        {productImage ? (
                          <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <img src={productImage} className="max-h-20 rounded-lg shadow-lg object-contain" />
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"><Check size={10} className="text-white" /></div>
                            <button onClick={(e) => { e.preventDefault(); setProductImage(null); }} className="absolute -bottom-2 -right-2 w-5 h-5 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors"><X size={10} className="text-white" /></button>
                            <p className="mt-2 text-[8px] font-black uppercase text-emerald-400">Produto</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center mb-2 text-white/30 group-hover:text-white transition-all"><Package size={16} /></div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-white">{t.studio.upload_product}</p>
                            <p className="text-[7px] text-white/30 mt-1 text-center font-medium bg-white/5 px-1.5 py-0.5 rounded-full">OPCIONAL</p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* 3. ENVIRONMENT BACKGROUND */}
                    <div className="relative group">
                      <input type="file" id="sidebar-environment-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'environment')} />
                      <label htmlFor="sidebar-environment-upload" className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer h-32 ${environmentImage ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                        {environmentImage ? (
                          <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <img src={environmentImage} className="max-h-20 rounded-lg shadow-lg object-contain" />
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"><Check size={10} className="text-white" /></div>
                            <button onClick={(e) => { e.preventDefault(); setEnvironmentImage(null); }} className="absolute -bottom-2 -right-2 w-5 h-5 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors"><X size={10} className="text-white" /></button>
                            <p className="mt-2 text-[8px] font-black uppercase text-blue-400">Ambiente</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center mb-2 text-white/30 group-hover:text-white transition-all"><ImageLucide size={16} /></div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-white">{t.studio.upload_background}</p>
                            <p className="text-[7px] text-white/30 mt-1 text-center font-medium bg-white/5 px-1.5 py-0.5 rounded-full">OPCIONAL</p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* 3. STYLE REFERENCE */}
                    <div className={`relative group ${useAiAvatar ? '' : ''}`}>
                      <input type="file" id="sidebar-ref-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'reference')} />
                      <label htmlFor="sidebar-ref-upload" className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer h-32 ${studioRefImage ? 'bg-yellow-600/10 border-yellow-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                        {studioRefImage ? (
                          <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <img src={studioRefImage} className="max-h-20 rounded-lg shadow-lg object-contain" />
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"><Check size={10} className="text-white" /></div>
                            <button onClick={(e) => { e.preventDefault(); setStudioRefImage(null); }} className="absolute -bottom-2 -right-2 w-5 h-5 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors"><X size={10} className="text-white" /></button>
                            <p className="mt-2 text-[8px] font-black uppercase text-yellow-400">ReferÃªncia</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center mb-2 text-white/30 group-hover:text-white transition-all"><Palette size={16} /></div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-white">{t.studio.upload_style_ref}</p>
                            <p className="text-[7px] text-white/30 mt-1 text-center font-medium bg-white/5 px-1.5 py-0.5 rounded-full">OPCIONAL</p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* AVATAR IA TOGGLE - RELOCATED */}
                    <button
                      onClick={() => { setUseAiAvatar(!useAiAvatar); if (!useAiAvatar) setUploadedImage(null); }}
                      className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer h-32 ${useAiAvatar ? 'bg-violet-600/10 border-violet-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-all ${useAiAvatar ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-white/30 group-hover:text-white'}`}>
                        <Sparkles size={16} />
                      </div>
                      <p className={`text-[9px] font-black uppercase tracking-wider transition-colors ${useAiAvatar ? 'text-violet-400' : 'text-white'}`}>{t.studio.create_avatar}</p>
                      <p className={`text-[7px] mt-1 text-center font-medium px-1.5 py-0.5 rounded-full transition-colors ${useAiAvatar ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-white/30'}`}>OPCIONAL</p>

                      {/* Custom Switch Visual */}
                      <div className={`mt-2 w-8 h-4 rounded-full transition-all relative ${useAiAvatar ? 'bg-violet-500' : 'bg-white/10'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${useAiAvatar ? 'left-4.5 translate-x-0.5' : 'left-0.5'}`} />
                      </div>
                    </button>

                    {/* ASPECT RATIO SELECTOR */}
                    <div className="col-span-2 p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-wider text-white/60">{t.studio.photo_format}</p>
                      <div className="flex gap-2">
                        {[
                          { value: '1:1', label: '1:1', Icon: Square },
                          { value: '4:5', label: '4:5', Icon: RectangleVertical },
                          { value: '9:16', label: '9:16', Icon: Smartphone },
                          { value: '16:9', label: '16:9', Icon: RectangleHorizontal },
                        ].map((ratio) => (
                          <button
                            key={ratio.value}
                            onClick={() => setConfig(prev => ({ ...prev, aspectRatio: ratio.value as any }))}
                            className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${config.aspectRatio === ratio.value ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                          >
                            <span className="block"><ratio.Icon size={16} /></span>
                            {ratio.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* RESULT COUNT SELECTOR */}
                    <div className="col-span-2 p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-wider text-white/60">{t.studio.image_quantity}</p>
                      <div className="flex gap-2">
                        {[1, 2, 3].map((count) => (
                          <button
                            key={count}
                            onClick={() => setConfig(prev => ({ ...prev, designCount: count }))}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${config.designCount === count ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-2 ${(studioRefImage && !isCreativeBackground) ? 'opacity-30 pointer-events-none' : ''}`}>
              {isCreativeBackground ? (
                <div className="col-span-2 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-orange-400">{t.studio.creative_mode_active}</p>
                  <p className="text-[9px] text-white/40 leading-relaxed">
                    {t.studio.creative_mode_desc}
                  </p>
                </div>
              ) : isStudioMode ? (
                <div className="col-span-2 flex flex-col gap-4">
                  {/* Category Tabs - Multiline */}
                  <div className="flex flex-wrap gap-2 pb-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                      >
                        {getTranslatedCategory(cat)}
                      </button>
                    ))}
                  </div>

                  {/* Style Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(StudioStyle)
                      .filter(style => StudioStyleMeta[style]?.category === selectedCategory)
                      .map((style) => {
                        const meta = StudioStyleMeta[style];
                        if (!meta) return null;
                        const isActive = config.studioStyle === style;
                        return (
                          <button
                            key={style}
                            onClick={() => { setConfig(prev => ({ ...prev, studioStyle: style })); setActivePulseStep(null); }}
                            disabled={!!studioRefImage}
                            className={`relative h-28 flex flex-col justify-end p-3 rounded-xl border transition-all overflow-hidden group ${isActive ? `border-amber-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]` : 'border-white/10 hover:border-white/30'}`}
                          >
                            <img src={meta.imageUrl} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isActive ? 'scale-110 opacity-100' : 'opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-80'}`} />
                            <div className={`absolute inset-0 bg-gradient-to-t ${isActive ? 'from-amber-900/90 via-amber-900/40' : 'from-black/90 via-black/20'} to-transparent transition-all`}></div>

                            <div className="relative z-10 flex flex-col items-start text-left">
                              <span className={`text-[10px] font-black uppercase leading-tight tracking-wide ${isActive ? 'text-white' : 'text-white/90'}`}>{t.studio_styles?.[style]?.name || style}</span>
                              <span className="text-[8px] font-medium text-white/60 leading-tight mt-1">{t.studio_styles?.[style]?.description || meta.description}</span>
                            </div>

                            {/* Active Indicator */}
                            {isActive && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                                <Check size={10} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>

                  {/* BIRTHDAY AGE FIELD - Only when birthday style selected */}
                  {config.studioStyle && (config.studioStyle as string).includes('Aniver') && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-amber-500/10 border border-pink-500/20 space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-wider text-pink-400/80 flex items-center gap-1.5">
                        🎂 Idade do Aniversariante
                      </p>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={config.birthdayAge || ''}
                        onChange={(e) => setConfig(prev => ({ ...prev, birthdayAge: e.target.value }))}
                        placeholder="Ex: 25, 30, 50..."
                        className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder-white/20 focus:border-pink-500 focus:bg-black/60 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <p className="text-[8px] text-white/30">A idade aparecerá nos balões numéricos e decorações</p>
                    </div>
                  )}

                  {/* CUSTOM INSTRUCTIONS BOX */}
                  <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-wider text-white/60">{t.studio.additional_instructions}</p>
                    <textarea
                      value={config.customInstructions || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, customInstructions: e.target.value }))}
                      placeholder={t.studio.additional_instructions_placeholder}
                      className="w-full h-20 p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/20 focus:border-amber-500 focus:bg-black/60 outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              ) : isMascotMode ? (
                // MASCOT STYLE SELECTOR
                Object.values(MascotStyle).map((style) => {
                  const meta = MascotStyleMeta[style];
                  const isActive = config.mascotStyle === style;
                  return (
                    <button
                      key={style}
                      onClick={() => { setConfig(prev => ({ ...prev, mascotStyle: style })); setActivePulseStep(null); }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all overflow-hidden aspect-square ${isActive ? `bg-orange-500/20 border-orange-500/50 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]` : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'}`}
                    >
                      <img src={meta.imageUrl} className={`absolute inset-0 w-full h-full object-cover transition-all opacity-40 group-hover:opacity-60 ${isActive ? 'opacity-60 scale-110' : 'grayscale'}`} />
                      <div className="absolute inset-0 bg-black/40"></div>
                      <span className="relative z-10 text-[9px] font-black uppercase text-center leading-tight">{style}</span>
                    </button> // End Mascot Button
                  );
                })
              ) : isMockupMode ? (
                // MOCKUP STYLE SELECTOR
                Object.values(MockupStyle).map((style) => {
                  const meta = MockupStyleMeta[style];
                  const isActive = config.mockupStyle === style;
                  return (
                    <button
                      key={style}
                      onClick={() => { setConfig(prev => ({ ...prev, mockupStyle: style })); setActivePulseStep(null); }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all overflow-hidden aspect-square ${isActive ? `bg-emerald-500/20 border-emerald-500/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]` : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'}`}
                    >
                      <img src={meta.imageUrl} className={`absolute inset-0 w-full h-full object-cover transition-all opacity-40 group-hover:opacity-60 ${isActive ? 'opacity-60 scale-110' : 'grayscale'}`} />
                      <div className="absolute inset-0 bg-black/40"></div>
                      <span className="relative z-10 text-[9px] font-black uppercase text-center leading-tight">{style}</span>
                    </button>
                  );
                })
              ) : (
                Object.values(VisualStyle).map((style) => (
                  <button
                    key={style}
                    onClick={() => { setConfig(prev => ({ ...prev, style })); setActivePulseStep(null); }}
                    disabled={!!studioRefImage}
                    className={`px-3 py-2.5 rounded-xl border text-[10px] font-bold transition-all ${config.style === style ? 'bg-yellow-600/20 border-yellow-500/50 text-white shadow-[0_0_15px_rgba(236,72,153,0.1)]' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'}`}
                  >
                    {style}
                  </button>
                ))
              )}
            </div>
          </section>

          {/* STEP 03 REMOVED completely as requested */}
        </div>

        <div className="p-5 md:p-8 border-t border-white/5 bg-[#0a0a0a] relative">
          <button
            onClick={() => { setShowMobileSidebar(false); handleGenerate(); }}
            disabled={isGenerating || !isReady}
            className={`w-full py-4 md:py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all tech-corners active:scale-[0.98] text-sm md:text-base ${isGenerating ? 'bg-white/5' : isReady ? 'bg-gradient-to-r from-amber-600 to-amber-500 shadow-[0_20px_50px_rgba(245,158,11,0.4)] opacity-100 animate-pulse-glow' : 'bg-white/5 text-white/20 border border-white/5 opacity-50 cursor-not-allowed'}`}
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill={isReady ? "currentColor" : "none"} className={isReady ? "" : "opacity-10"} />}
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black">
              {isGenerating ? t.sidebar.processing : isCreativeBackground ? t.studio.generate_theme : t.sidebar.generate_btn}
            </span>
          </button>
        </div>
      </aside >

      {/* MAIN VIEWPORT */}
      < main className="flex-1 relative flex flex-col bg-transparent overflow-hidden" >
        <div className="hidden md:flex w-full flex-shrink-0 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-[#0a0a0f]/95 to-black/90 backdrop-blur-3xl z-30 p-4 justify-between items-center">

          {/* USER INFO HEADER */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-white/70 font-medium">{user.email}</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                  <span className="text-xs text-amber-200/70 uppercase tracking-wider font-bold">Créditos:</span>
                  <span className="text-xs text-amber-400 font-black">{credits}</span>
                </div>

                {lastPurchaseDate && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-white/5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Última Compra:</span>
                    <span className="text-xs text-white/70 font-medium">{lastPurchaseDate}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {(['pt', 'en', 'es', 'fr', 'it'] as Language[]).map((lang) => {
              const flags: Record<string, string> = {
                pt: 'https://flagcdn.com/w40/br.png',
                en: 'https://flagcdn.com/w40/us.png',
                es: 'https://flagcdn.com/w40/es.png',
                fr: 'https://flagcdn.com/w40/fr.png',
                it: 'https://flagcdn.com/w40/it.png'
              };
              return (
                <button key={lang} onClick={() => setLanguage(lang)} className={`w-8 h-8 flex items-center justify-center rounded overflow-hidden transition-all ${language === lang ? 'bg-white/10 grayscale-0 scale-110 ring-2 ring-amber-500/50' : 'grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}>
                  <img src={flags[lang]} alt={lang} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 scrollbar-hide bg-[#050505]/20 relative">
          {error && (
            <div className="mb-12 p-8 glass-panel border-red-500/20 rounded-[2.5rem] flex items-start gap-5 text-red-400 max-w-2xl mx-auto animate-in slide-in-from-top-4 duration-500">
              <div className="p-3 bg-red-500/10 rounded-2xl"><AlertCircle size={28} /></div>
              <div className="flex-1">
                <p className="font-black text-lg uppercase tracking-widest">{t.alerts.system_alert}</p>
                <p className="text-sm opacity-70 mt-1 leading-relaxed">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
            </div>
          )}

          {!isGenerating && results.length === 0 && !error && !selectedImage && (
            <div className="flex flex-col items-center min-h-[70vh] animate-in fade-in duration-700">

              {isStudioMode ? (
                /* CURADORIA DE ESTILOS VISUAL */
                <div className="w-full max-w-4xl mx-auto space-y-12 pb-20 mt-12">
                  <div className="p-8 md:p-16 rounded-[3rem] bg-gradient-to-br from-amber-600/10 via-amber-500/5 to-transparent border border-amber-500/20 text-center space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] group-hover:bg-amber-500/20 transition-all duration-1000"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-600/10 rounded-full blur-[80px] group-hover:bg-amber-600/20 transition-all duration-1000"></div>

                    <div className="relative space-y-6">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <ShoppingBag size={40} className="text-black" strokeWidth={2.5} />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
                          {t.studio.buy_credits_msg}
                        </h3>
                        <p className="text-white/40 text-xs md:text-sm font-medium uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
                          Desbloqueie o poder da inteligência artificial aplicada ao seu negócio
                        </p>
                      </div>

                      <button
                        onClick={() => setShowPaywall(true)}
                        className="group/btn relative px-8 md:px-12 py-4 md:py-6 bg-white text-black rounded-2xl font-black uppercase text-xs md:text-sm tracking-[0.2em] shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 flex items-center gap-4 mx-auto"
                      >
                        <Zap size={18} fill="currentColor" />
                        {t.studio.buy_credits_btn}
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Trust Badges / Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Check size={14} className="text-amber-500" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Qualidade Pro</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Check size={14} className="text-amber-500" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Entrega Imediata</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Check size={14} className="text-amber-500" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Vários Estilos</span>
                    </div>
                  </div>
                </div>
              ) : isMascotMode ? (
                /* MASCOT MODE MAIN UI */
                <div className="w-full max-w-6xl space-y-12 pb-20">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center px-4 py-1.5 bg-orange-600/10 border border-orange-500/20 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-4">{t.main.step01_label.replace('01', '02')}</div>
                    <h3 className="text-4xl font-black tracking-tight text-white uppercase">{t.main.curation_title}</h3>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">{t.main.curation_subtitle}</p>
                  </div>

                  {/* MASCOT STYLE GRID */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.values(MascotStyle).map((style) => {
                      const meta = MascotStyleMeta[style];
                      const isActive = config.mascotStyle === style;
                      return (
                        <button
                          key={style}
                          onClick={() => setConfig(prev => ({ ...prev, mascotStyle: style }))}
                          className={`group relative flex flex-col items-center justify-end p-6 aspect-square rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${isActive ? 'border-orange-500 active-glow' : 'border-white/5 hover:border-white/20 bg-white/[0.02]'}`}
                        >
                          <img
                            src={meta.imageUrl}
                            alt={style}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isActive ? 'scale-105 grayscale-0' : 'grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105'}`}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity`}></div>
                          {isActive && (
                            <div className="absolute top-6 right-6 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-300">
                              <Check size={16} strokeWidth={4} />
                            </div>
                          )}
                          <div className="relative z-10 text-center space-y-1">
                            <p className="text-[12px] font-black uppercase tracking-[0.1em] text-white drop-shadow-lg">{t.mascot_styles?.[style]?.name || style}</p>
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-white/90 transition-colors drop-shadow-md">{t.mascot_styles?.[style]?.description || meta.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* MASCOT UPLOAD HUB */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    {/* CLIENT PHOTO 1 (PRIMARY) */}
                    <div className="relative group">
                      <input type="file" id="mascot-client-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'customModel')} />
                      <label htmlFor="mascot-client-upload" className={`flex flex-col items-center justify-center p-8 rounded-[3rem] border-2 border-dashed transition-all cursor-pointer h-[240px] ${customModelImage ? 'bg-orange-600/5 border-orange-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                        {customModelImage ? (
                          <div className="relative w-full h-full flex flex-col items-center">
                            <img src={customModelImage} className="w-full h-full object-contain rounded-2xl" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shadow-lg"><Check size={16} /></div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-white/30 group-hover:text-white transition-all"><User size={24} /></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{t.studio.mascot.main_photo}</p>
                            <p className="text-[8px] text-white/20 mt-1 font-bold uppercase tracking-widest text-center">{t.studio.mascot.face_desc}</p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* CLIENT PHOTO 2 (SECONDARY) */}
                    <div className="relative group">
                      <input type="file" id="mascot-client-upload-2" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'subject')} />
                      <label htmlFor="mascot-client-upload-2" className={`flex flex-col items-center justify-center p-8 rounded-[3rem] border-2 border-dashed transition-all cursor-pointer h-[240px] ${uploadedImage ? 'bg-orange-600/5 border-orange-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                        {uploadedImage ? (
                          <div className="relative w-full h-full flex flex-col items-center">
                            <img src={uploadedImage} className="w-full h-full object-contain rounded-2xl" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shadow-lg"><Check size={16} /></div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-white/30 group-hover:text-white transition-all"><Camera size={24} /></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{t.studio.mascot.extra_photo}</p>
                            <p className="text-[8px] text-white/20 mt-1 font-bold uppercase tracking-widest text-center">{t.studio.mascot.extra_desc}</p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* STYLE REFERENCE */}
                    <div className="relative group">
                      <input type="file" id="mascot-ref-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'reference')} />
                      <label htmlFor="mascot-ref-upload" className={`flex flex-col items-center justify-center p-8 rounded-[3rem] border-2 border-dashed transition-all cursor-pointer h-[240px] ${studioRefImage ? 'bg-yellow-600/5 border-yellow-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                        {studioRefImage ? (
                          <div className="relative w-full h-full flex flex-col items-center">
                            <img src={studioRefImage} className="w-full h-full object-contain rounded-2xl" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center shadow-lg"><Check size={16} /></div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-white/30 group-hover:text-white transition-all"><Palette size={24} /></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{t.studio.mascot.visual_ref}</p>
                            <p className="text-[8px] text-white/20 mt-1 font-bold uppercase tracking-widest text-center">{t.studio.mascot.style_desc}</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              ) : isMockupMode ? (
                /* MOCKUP MODE UPLOAD HUB */
                <div className="w-full max-w-4xl space-y-12 pb-20">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center px-4 py-1.5 bg-emerald-600/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">{t.main.step01_label.replace('01', '03')}</div>
                    <h3 className="text-4xl font-black tracking-tight text-white uppercase">{t.main.upload_your_photo}</h3>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">{t.studio.mockup.upload_desc}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
                    <div className="relative group">
                      <input type="file" id="mockup-design-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'subject')} />
                      <label htmlFor="mockup-design-upload" className={`flex flex-col items-center justify-center p-8 rounded-[3rem] border-2 border-dashed transition-all cursor-pointer h-[320px] ${uploadedImage ? 'bg-emerald-600/5 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                        {uploadedImage ? (
                          <div className="relative w-full h-full flex flex-col items-center">
                            <img src={uploadedImage} className="w-full h-full object-contain rounded-2xl shadow-2xl" />
                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in"><Check size={20} strokeWidth={3} /></div>
                            <div className="mt-4 px-4 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                              Arte Carregada
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-white/30 group-hover:text-white transition-all group-hover:scale-110"><ImageLucide size={32} /></div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{t.studio.mockup.upload_action}</p>
                            <p className="text-[9px] text-white/20 mt-2 font-bold uppercase tracking-widest text-center max-w-[200px]">{t.studio.mockup.file_types}</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              ) : isCreativeBackground ? (
                /* CREATIVE BACKGROUND UPLOAD HUB */
                <div className="w-full max-w-5xl space-y-12 pb-20">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center px-4 py-1.5 bg-orange-600/10 border border-orange-500/20 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-4">{t.main.step01_label.replace('01', '03')}</div>
                    <h3 className="text-4xl font-black tracking-tight text-white uppercase">{t.studio.creative.title}</h3>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">{t.studio.creative.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* 1. MODEL/PRODUCT UPLOAD */}
                    <div className="relative group">
                      <input type="file" id="creative-model-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'customModel')} />
                      <label htmlFor="creative-model-upload" className={`flex flex-col items-center justify-center p-8 rounded-[3rem] border-2 border-dashed transition-all cursor-pointer h-[320px] ${customModelImage ? 'bg-orange-600/5 border-orange-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                        {customModelImage ? (
                          <div className="relative w-full h-full flex flex-col items-center">
                            <img src={customModelImage} className="w-full h-full object-contain rounded-2xl" />
                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center shadow-lg"><Check size={20} /></div>
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-orange-400">{t.studio.creative.model_loaded}</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-white/30 group-hover:scale-110 group-hover:text-white transition-all"><User size={32} /></div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{t.studio.creative.upload_model}</p>
                            <p className="text-[9px] text-white/20 mt-2 font-bold uppercase tracking-widest text-center">{t.studio.creative.model_desc}</p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* 2. STYLE/LOGO UPLOAD */}
                    <div className="relative group">
                      <input type="file" id="creative-ref-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'reference')} />
                      <label htmlFor="creative-ref-upload" className={`flex flex-col items-center justify-center p-8 rounded-[3rem] border-2 border-dashed transition-all cursor-pointer h-[320px] ${studioRefImage ? 'bg-yellow-600/5 border-yellow-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                        {studioRefImage ? (
                          <div className="relative w-full h-full flex flex-col items-center">
                            <img src={studioRefImage} className="w-full h-full object-contain rounded-2xl" />
                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center shadow-lg"><Check size={20} /></div>
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-yellow-400">{t.studio.creative.ref_loaded}</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-white/30 group-hover:scale-110 group-hover:text-white transition-all"><Palette size={32} /></div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{t.studio.creative.upload_ref}</p>
                            <p className="text-[9px] text-white/20 mt-2 font-bold uppercase tracking-widest text-center">{t.studio.creative.ref_desc}</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* BRAND COLORS SECTION */}
                  <div className="flex flex-col items-center justify-center space-y-6 pt-8 border-t border-white/5 w-full max-w-2xl mx-auto animate-in fade-in duration-500">
                    <div className="text-center space-y-2">
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">{t.studio.creative.brand_colors}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.studio.creative.brand_colors_desc}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {(config.brandColors || ['#000000', '#FFFFFF']).map((color, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 animate-in zoom-in duration-300">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...(config.brandColors || ['#000000', '#FFFFFF'])];
                              newColors[index] = e.target.value;
                              setConfig(prev => ({ ...prev, brandColors: newColors }));
                            }}
                            className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...(config.brandColors || ['#000000', '#FFFFFF'])];
                              newColors[index] = e.target.value;
                              setConfig(prev => ({ ...prev, brandColors: newColors }));
                            }}
                            className="w-24 bg-transparent text-white font-mono text-xs uppercase focus:outline-none"
                            placeholder="#000000"
                          />
                          {/* Only allow removing if we have more than 2 colors */}
                          {(config.brandColors || []).length > 2 && (
                            <button
                              onClick={() => {
                                const newColors = [...(config.brandColors || [])];
                                newColors.splice(index, 1);
                                setConfig(prev => ({ ...prev, brandColors: newColors }));
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Add Color Button */}
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, brandColors: [...(prev.brandColors || ['#000000', '#FFFFFF']), '#000000'] }))}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-amber-600 hover:text-white rounded-xl border border-white/10 border-dashed transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}


          {
            isGenerating && (
              <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
                <div className="relative">
                  <div className="w-48 h-48 border-[1px] border-white/5 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-0 w-48 h-48 border-t-[1px] border-amber-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-white tracking-[0.2em] uppercase animate-pulse">{t.main.designing_title}</span>
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">{t.main.accelerating_network}</p>
              </div>
            )
          }

          {
            results.length > 0 && !isGenerating && !selectedImage && (
              <div className="space-y-8 md:space-y-16 max-w-[1400px] mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-20">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">{t.main.results_title}</h3>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    {isCreativeBackground && (
                      <button
                        onClick={handleDownloadPPT}
                        className="px-4 md:px-8 py-2 md:py-3 bg-[#D04423] text-white rounded-xl font-black uppercase tracking-wide md:tracking-[0.2em] text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(208,68,35,0.4)] flex items-center gap-2 md:gap-3 animate-in fade-in"
                      >
                        <FileText size={16} />
                        BAIXAR PPTX
                      </button>
                    )}
                    <button
                      onClick={handleReset}
                      className="px-4 md:px-8 py-2 md:py-3 bg-white text-black rounded-xl font-black uppercase tracking-wide md:tracking-[0.2em] text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 md:gap-3"
                    >
                      <RotateCw size={16} />
                      {t.main.new_creation}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                  {results.map((variation) => (
                    <div key={variation.id} className="space-y-6">
                      <div className="flex items-center gap-6"><div className="px-6 py-2 bg-amber-600/10 border border-amber-500/20 rounded-full text-[12px] font-black text-amber-400 uppercase tracking-[0.4em]">Design {variation.variation}</div><div className="h-px flex-1 bg-white/5"></div></div>
                      <div className="group relative glass-panel rounded-3xl overflow-hidden border-white/5 hover:border-amber-500/50 transition-all duration-500 shadow-2xl bg-zinc-900 min-h-[400px] flex items-center justify-center">
                        {refreshingId === variation.id ? (
                          <Loader2 className="animate-spin text-amber-500" size={40} />
                        ) : (
                          <>
                            <div className={`w-full h-full ${getAspectClass(config.aspectRatio)} overflow-hidden relative`}>
                              <img src={variation.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

                              {/* LIVE TEXT PREVIEW OVERLAY */}
                              {!isStudioMode && config.copyText && config.useBoxLayout && (
                                <div className="absolute inset-0 flex items-start justify-center pt-20 p-8 pointer-events-none z-10 transition-opacity duration-500 animate-in fade-in">
                                  <h2
                                    className="text-white font-bold text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                                    style={{
                                      fontSize: 'clamp(24px, 5vw, 48px)',
                                      fontFamily: 'Inter',
                                      lineHeight: 1.2,
                                      whiteSpace: 'pre-wrap'
                                    }}
                                  >
                                    {config.copyText}
                                  </h2>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 active:opacity-100 flex items-center justify-center gap-2 md:gap-4 transition-all duration-300 backdrop-blur-[2px]">
                              <button onClick={() => downloadPreview(variation)} className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-900 shadow-xl hover:scale-110 active:scale-95 transition-all" title="Baixar PrÃ©via (Cliente)"><Eye size={18} className="md:hidden" /><Eye size={24} className="hidden md:block" /></button>
                              <button onClick={() => downloadImageDirectly(variation.url, variation.variation)} className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-900 shadow-xl hover:scale-110 active:scale-95 transition-all" title="Baixar PNG"><ImageIcon size={18} className="md:hidden" /><ImageIcon size={24} className="hidden md:block" /></button>
                              <button onClick={() => setEditingImage(variation)} className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-900 shadow-xl hover:scale-110 active:scale-95 transition-all" title="Editar Texto"><Edit3 size={18} className="md:hidden" /><Edit3 size={24} className="hidden md:block" /></button>

                              <button onClick={() => handleRefreshVariation(variation.id)} className="w-10 h-10 md:w-14 md:h-14 bg-[#ec4899] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all" title="Regenerar"><RotateCw size={18} className="md:hidden" /><RotateCw size={24} className="hidden md:block" /></button>
                            </div>

                            {/* VIDEO ANIMATION BUTTON */}
                          </>
                        )}
                      </div>


                    </div>
                  ))}
                </div>
              </div>
            )}




          {
            selectedImage && (
              <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in zoom-in-95 duration-500">
                <div className="h-16 md:h-24 px-4 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-3xl">
                  <button onClick={() => setSelectedImage(null)} className="p-2 md:p-4 hover:bg-white/5 rounded-xl md:rounded-2xl transition-all text-white/30 hover:text-white flex items-center gap-2 md:gap-3 text-sm"><X size={20} /> <span className="hidden md:inline">Sair</span></button>
                  <div className="flex items-center gap-2 md:gap-4">
                    {isEditableMode && (
                      <div className="hidden md:flex items-center gap-4 mr-8 p-2 bg-white/5 rounded-xl border border-white/10">
                        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" />
                        <input type="range" min="20" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24 accent-amber-500" />
                        <div className="flex flex-col gap-1">
                          <button onClick={() => setTextPosition(p => ({ ...p, y: p.y - 5 }))}><Move size={14} className="text-white/50 hover:text-white" /></button>
                          <button onClick={() => setTextPosition(p => ({ ...p, y: p.y + 5 }))}><Move size={14} className="text-white/50 hover:text-white rotate-180" /></button>
                        </div>
                      </div>
                    )}
                    <button onClick={() => downloadPreview(selectedImage)} className="hidden md:flex px-6 py-4 bg-white/5 text-white/60 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] items-center gap-3 hover:bg-white/10 hover:text-white transition-all"><Eye size={18} /> PRÃ‰VIA</button>
                    <button onClick={() => downloadImageDirectly(selectedImage.url, selectedImage.variation)} className="px-4 md:px-8 py-3 md:py-4 bg-white text-black rounded-xl md:rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-widest md:tracking-[0.4em] flex items-center gap-2 md:gap-4 hover:scale-105 transition-all"><Download size={18} /> <span className="hidden md:inline">PNG</span></button>

                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 md:p-12 overflow-hidden bg-[#050505]">
                  <div className={`${getAspectClass(config.aspectRatio)} max-h-full rounded-2xl md:rounded-[4rem] overflow-hidden shadow-2xl border border-white/10 relative`}>
                    <img src={selectedImage.url} className="w-full h-full object-contain" />

                    {isEditableMode && config.copyText && (
                      <div
                        style={{
                          position: 'absolute',
                          top: `${textPosition.y}%`,
                          left: `${textPosition.x}%`,
                          transform: 'translate(-50%, -50%)',
                          color: textColor,
                          fontSize: `${fontSize}px`,
                          lineHeight: 1.1,
                          textShadow: '0px 10px 20px rgba(0,0,0,0.5)'
                        }}
                        className="font-black uppercase text-center tracking-tighter cursor-move select-none z-20 whitespace-pre-wrap"
                      >
                        {config.copyText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          }
        </div >
      </main >

      {
        editingImage && (
          <TextEditor
            image={editingImage}
            aspectRatio={config.aspectRatio}
            initialLayers={persistentLayers[editingImage.id]}
            initialText={config.useBoxLayout ? config.copyText : ''} // Only inject text if it's meant to be editable (Box Mode)
            onClose={() => setEditingImage(null)}
            onSave={handleUpdateImage}
            onUpdate={handleLayerUpdate}
            onMagicEdit={async (prompt) => {
              if (!editingImage) return;
              try {
                // Mock loading / toast here if needed, but TextEditor handles its own loading state
                const newImageUrl = await editGeneratedImage(editingImage.url, prompt, config.aspectRatio, apiKey || undefined);
                if (newImageUrl) {
                  const updatedImage = { ...editingImage, url: newImageUrl };
                  setResults(prev => prev.map(img => img.id === editingImage.id ? updatedImage : img));
                  setEditingImage(updatedImage);
                }
              } catch (e) {
                console.error("Magic Edit Error", e);
                alert("Erro ao editar imagem. Tente novamente.");
              }
            }}
          />
        )
      }



      {/* Mobile Floating Action Button */}
      {
        !showMobileSidebar && results.length === 0 && !isGenerating && (
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-[0_10px_30px_rgba(245,158,11,0.4)] active:scale-95 transition-all"
          >
            <Sliders size={24} />
          </button>
        )
      }

      {
        showPaywall && (
          <div className="fixed inset-0 z-[60] bg-black">
            <CheckoutPage onBack={() => setShowPaywall(false)} />
          </div>
        )
      }

    </div >
  );
};

export default App;
