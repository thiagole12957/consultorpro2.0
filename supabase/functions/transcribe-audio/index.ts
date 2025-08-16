import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "npm:openai@4.28.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    if (req.method === "POST") {
      const formData = await req.formData()
      const audioFile = formData.get('audio') as File
      const language = formData.get('language') as string || 'pt'
      const prompt = formData.get('prompt') as string || 'Esta é uma reunião de negócios em português brasileiro.'

      if (!audioFile) {
        return new Response(
          JSON.stringify({ error: 'Arquivo de áudio é obrigatório' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Converter File para formato aceito pelo OpenAI
      const audioBuffer = await audioFile.arrayBuffer()
      const audioBlob = new Blob([audioBuffer], { type: audioFile.type })

      // Transcrever com Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioBlob as any,
        model: "whisper-1",
        language: language,
        prompt: prompt,
        response_format: "verbose_json",
        timestamp_granularities: ["segment"]
      })

      // Processar transcrição com timestamps
      const segments = transcription.segments || []
      const transcriptionWithTimestamps = segments.map(segment => ({
        start: segment.start,
        end: segment.end,
        text: segment.text,
        timestamp: formatTimestamp(segment.start)
      }))

      return new Response(
        JSON.stringify({
          success: true,
          transcription: {
            text: transcription.text,
            segments: transcriptionWithTimestamps,
            language: transcription.language,
            duration: transcription.duration
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Erro na transcrição:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `[${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}]`
}