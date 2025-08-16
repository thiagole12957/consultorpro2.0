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
      const { transcription, meetingContext } = await req.json()

      if (!transcription) {
        return new Response(
          JSON.stringify({ error: 'Transcrição é obrigatória' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const prompt = `
Você é um assistente especializado em resumir reuniões de negócios. 
Analise a seguinte transcrição de reunião e gere um resumo estruturado em português brasileiro.

CONTEXTO DA REUNIÃO:
${meetingContext || 'Reunião de negócios'}

TRANSCRIÇÃO:
${transcription}

Por favor, gere um resumo seguindo exatamente este formato:

🤖 RESUMO GERADO POR IA - ${new Date().toLocaleDateString('pt-BR')}

📋 TÓPICOS PRINCIPAIS:
• [Liste os principais tópicos discutidos]

🎯 DECISÕES TOMADAS:
• [Liste as decisões importantes tomadas]

📝 PRÓXIMOS PASSOS:
• [Liste as ações definidas com responsáveis e prazos quando mencionados]

👥 PARTICIPANTES: [Liste os participantes identificados]
⏱️ DURAÇÃO: [Duração estimada]
📊 PRÓXIMA REUNIÃO: [Se mencionada]

Seja conciso mas completo. Use emojis e formatação clara.
`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em resumir reuniões de negócios em português brasileiro. Seja preciso, objetivo e use formatação clara com emojis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })

      const summary = completion.choices[0]?.message?.content || 'Não foi possível gerar o resumo.'

      // Extrair insights adicionais
      const insightsPrompt = `
Baseado na transcrição da reunião, identifique:

1. SENTIMENTO GERAL: (Positivo/Neutro/Negativo)
2. NÍVEL DE ENGAJAMENTO: (Alto/Médio/Baixo)
3. PRINCIPAIS PREOCUPAÇÕES: [Liste até 3]
4. OPORTUNIDADES IDENTIFICADAS: [Liste até 3]
5. RISCOS MENCIONADOS: [Liste até 3]

Transcrição: ${transcription}

Responda em formato JSON:
{
  "sentimento": "string",
  "engajamento": "string", 
  "preocupacoes": ["string"],
  "oportunidades": ["string"],
  "riscos": ["string"]
}
`

      const insightsCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: insightsPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.2
      })

      let insights = {}
      try {
        insights = JSON.parse(insightsCompletion.choices[0]?.message?.content || '{}')
      } catch (e) {
        console.error('Erro ao parsear insights:', e)
      }

      return new Response(
        JSON.stringify({
          success: true,
          summary,
          insights,
          generatedAt: new Date().toISOString()
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
    console.error('Erro na geração de resumo:', error)
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