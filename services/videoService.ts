import { supabase } from './supabaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/\n/g, '');

export interface VideoGenerationResult {
    request_id: string;
    status: string;
    status_url?: string;
    response_url?: string;
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

    // Read response body as text first to handle non-JSON errors
    const responseText = await response.text();
    console.log('Submit response status:', response.status, 'body:', responseText.substring(0, 500));

    if (!response.ok) {
        let errorMsg = `Erro do servidor (${response.status})`;
        try {
            const data = JSON.parse(responseText);
            errorMsg = data.error || errorMsg;
            if (data.code) errorMsg += ` [${data.code}]`;
        } catch { /* response is not JSON */ }
        throw new Error(errorMsg);
    }

    const data = JSON.parse(responseText);
    return data;
};

// Check video generation status — uses status_url from submit if provided
export const checkVideoStatus = async (
    requestId: string,
    statusUrl?: string,
    responseUrl?: string,
): Promise<any> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-video`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            action: 'status',
            request_id: requestId,
            status_url: statusUrl,
            response_url: responseUrl,
        }),
    });

    const responseText = await response.text();

    if (!response.ok) {
        console.error('Status check FULL response:', response.status, responseText);
        let errorMsg = `Status check failed (${response.status})`;
        try {
            const data = JSON.parse(responseText);
            errorMsg = data.error || errorMsg;
            if (data.details) errorMsg += ` | Details: ${data.details}`;
            if (data.fal_status) errorMsg += ` | Fal status: ${data.fal_status}`;
        } catch { /* not JSON */ 
            errorMsg += ` | Raw: ${responseText.substring(0, 200)}`;
        }
        throw new Error(errorMsg);
    }

    return JSON.parse(responseText);
};

// Get final video result — uses response_url from submit if provided
export const getVideoResult = async (
    requestId: string,
    responseUrl?: string,
): Promise<any> => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-video`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            action: 'result',
            request_id: requestId,
            response_url: responseUrl,
        }),
    });

    return response.json();
};

// Poll for video completion with progress percentage
export const waitForVideo = async (
    requestId: string,
    onProgress?: (status: string, percent: number) => void,
    maxWaitMs: number = 480000, // 8 min max
    statusUrl?: string,
    responseUrl?: string,
): Promise<string> => {
    const startTime = Date.now();
    const pollInterval = 5000; // check every 5 seconds
    const estimatedDuration = 120000; // ~2 min estimated
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 8; // More tolerant — status errors don't mean video failed

    while (Date.now() - startTime < maxWaitMs) {
        const elapsed = Date.now() - startTime;
        // Simulate progress: goes to 90% based on time, then waits for completion
        const timeProgress = Math.min(90, (elapsed / estimatedDuration) * 90);

        try {
            const statusData = await checkVideoStatus(requestId, statusUrl, responseUrl);
            consecutiveErrors = 0; // Reset on success

            if (statusData.status === 'COMPLETED') {
                onProgress?.('Finalizando...', 95);
                // Get the final result
                const result = await getVideoResult(requestId, responseUrl);
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

            // Update progress with describing status
            if (statusData.status === 'IN_QUEUE') {
                onProgress?.('Na fila...', Math.min(timeProgress, 20));
            } else if (statusData.status === 'IN_PROGRESS') {
                onProgress?.('Gerando vídeo...', Math.max(20, timeProgress));
            } else {
                onProgress?.(statusData.status || 'Processando...', timeProgress);
            }
        } catch (err: any) {
            consecutiveErrors++;
            console.error(`Video status check error (${consecutiveErrors}/${maxConsecutiveErrors}):`, err.message);
            
            if (consecutiveErrors >= maxConsecutiveErrors) {
                throw new Error(
                    err.message || 'Erro ao verificar status do vídeo. O serviço pode estar indisponível.'
                );
            }
            
            onProgress?.('Reconectando...', timeProgress);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Tempo limite excedido. O vídeo pode ainda estar sendo gerado.');
};
