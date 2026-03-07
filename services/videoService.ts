import { supabase } from './supabaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/\n/g, '');

export interface VideoGenerationResult {
    request_id: string;
    status: string;
    new_credits?: number;
    video?: {
        url: string;
    };
    error?: string;
}

const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
        'apikey': SUPABASE_ANON_KEY || '',
    };
};

// Convert base64 data URL to a publicly accessible URL via Supabase Storage
const uploadBase64ToStorage = async (base64DataUrl: string): Promise<string> => {
    // Extract the base64 content
    const matches = base64DataUrl.match(/^data:image\/(png|jpeg|jpg|webp);?\s*base64,?\s*(.+)$/i);
    if (!matches) {
        throw new Error('Formato de imagem inválido');
    }

    const ext = matches[1].toLowerCase();
    const base64Data = matches[2].trim();

    // Convert to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Upload to Supabase Storage
    const fileName = `video-input/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { data, error } = await supabase.storage
        .from('generated-images')
        .upload(fileName, bytes.buffer, {
            contentType: `image/${ext}`,
            upsert: false,
        });

    if (error) {
        console.error('Storage upload error:', error);
        throw new Error('Erro ao fazer upload da imagem para animação');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('generated-images')
        .getPublicUrl(fileName);

    console.log('Image uploaded to:', urlData.publicUrl);
    return urlData.publicUrl;
};

// Submit video generation request
export const submitVideoGeneration = async (imageUrl: string): Promise<VideoGenerationResult> => {
    const headers = await getAuthHeaders();

    // If the image is a base64 data URL, upload it first
    let finalImageUrl = imageUrl;
    if (imageUrl.startsWith('data:image')) {
        console.log('Uploading base64 image to storage...');
        finalImageUrl = await uploadBase64ToStorage(imageUrl);
        console.log('Image uploaded, public URL:', finalImageUrl);
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-video`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'submit', image_url: finalImageUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Erro ao iniciar geração de vídeo');
    }

    return data;
};

// Check video generation status
export const checkVideoStatus = async (requestId: string): Promise<any> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-video`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'status', request_id: requestId }),
    });

    return response.json();
};

// Get final video result
export const getVideoResult = async (requestId: string): Promise<any> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-video`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'result', request_id: requestId }),
    });

    return response.json();
};

// Poll for video completion with progress percentage
export const waitForVideo = async (
    requestId: string,
    onProgress?: (status: string, percent: number) => void,
    maxWaitMs: number = 300000 // 5 min max
): Promise<string> => {
    const startTime = Date.now();
    const pollInterval = 5000; // check every 5 seconds
    const estimatedDuration = 120000; // ~2 min estimated

    while (Date.now() - startTime < maxWaitMs) {
        const elapsed = Date.now() - startTime;
        // Simulate progress: goes to 90% based on time, then waits for completion
        const timeProgress = Math.min(90, (elapsed / estimatedDuration) * 90);

        const statusData = await checkVideoStatus(requestId);

        if (statusData.status === 'COMPLETED') {
            onProgress?.('Finalizando...', 95);
            // Get the final result
            const result = await getVideoResult(requestId);
            onProgress?.('Pronto!', 100);

            // Try multiple response shapes
            const videoUrl = result?.video?.url
                || result?.data?.video?.url
                || result?.output?.video?.url
                || result?.video_url;

            if (videoUrl) return videoUrl;

            console.log('Video result shape:', JSON.stringify(result));
            throw new Error('Vídeo gerado mas URL não encontrada');
        }

        if (statusData.status === 'FAILED') {
            throw new Error('Falha na geração do vídeo. Tente novamente.');
        }

        // Update progress with descring status
        if (statusData.status === 'IN_QUEUE') {
            onProgress?.('Na fila...', Math.min(timeProgress, 20));
        } else if (statusData.status === 'IN_PROGRESS') {
            onProgress?.('Gerando vídeo...', Math.max(20, timeProgress));
        } else {
            onProgress?.(statusData.status || 'Processando...', timeProgress);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Tempo limite excedido. O vídeo pode ainda estar sendo gerado.');
};
