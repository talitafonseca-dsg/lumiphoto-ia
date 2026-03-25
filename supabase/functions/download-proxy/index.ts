import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { url, filename } = await req.json();

    if (!url || !filename) {
      return new Response(
        JSON.stringify({ error: "url and filename are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate URL - only allow known CDN domains
    const allowedDomains = [
      "fal.media",
      "v3b.fal.media",
      "storage.googleapis.com",
      "generativelanguage.googleapis.com",
    ];
    
    const parsedUrl = new URL(url);
    const domainAllowed = allowedDomains.some(d => parsedUrl.hostname.endsWith(d));
    
    if (!domainAllowed) {
      return new Response(
        JSON.stringify({ error: "URL domain not allowed" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the file from the external URL (server-side, no CORS issues)
    const fileResponse = await fetch(url);
    
    if (!fileResponse.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch file: ${fileResponse.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fileBlob = await fileResponse.blob();
    
    // Determine content type from filename extension
    let contentType = fileResponse.headers.get("content-type") || "application/octet-stream";
    if (filename.endsWith(".png")) contentType = "image/png";
    else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
    else if (filename.endsWith(".mp4")) contentType = "video/mp4";
    else if (filename.endsWith(".webm")) contentType = "video/webm";

    return new Response(fileBlob, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Proxy error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
