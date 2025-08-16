export class TranscriptionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private onTranscriptionUpdate?: (text: string) => void;
  private recordingInterval: number | null = null;

  constructor(onTranscriptionUpdate?: (text: string) => void) {
    this.onTranscriptionUpdate = onTranscriptionUpdate;
  }

  private getSupportedMimeType(): string {
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/wav'
    ];

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }

    // Fallback para o padrão se nenhum for suportado
    return 'audio/webm';
  }

  async startTranscription(stream: MediaStream): Promise<void> {
    try {
      this.audioChunks = [];
      
      // Inicializar MediaRecorder
      await this.initializeMediaRecorder(stream);
      this.isRecording = true;

      // Processar áudio em chunks de 30 segundos para transcrição em tempo real
      this.recordingInterval = window.setInterval(async () => {
        if (this.mediaRecorder && this.isRecording) {
          this.mediaRecorder.stop();
        }
      }, 30000);

    } catch (error) {
      console.error('Erro ao iniciar transcrição:', error);
      throw error;
    }
  }

  private async initializeMediaRecorder(stream: MediaStream): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Obter MIME type suportado pelo navegador
        const supportedMimeType = this.getSupportedMimeType();
        
        // Configurar MediaRecorder com MIME type compatível
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: supportedMimeType
        });

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = async () => {
          await this.processAudioChunks();
          
          // Se ainda estiver gravando, reinicializar com novo MediaRecorder
          if (this.isRecording) {
            await new Promise(resolve => setTimeout(resolve, 200)); // Aguardar transição de estado
            await this.initializeMediaRecorder(stream);
          }
        };

        // Iniciar gravação
        this.mediaRecorder.start();
        resolve();
        
      } catch (error) {
        reject(error);
      }
    });
  }

  async stopTranscription(): Promise<string> {
    this.isRecording = false;
    
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    // Aguardar processamento final
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.getFullTranscription();
  }

  private async processAudioChunks(): Promise<void> {
    if (this.audioChunks.length === 0) return;

    try {
      // Combinar chunks de áudio
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      
      // Enviar para API de transcrição
      const transcription = await this.transcribeAudio(audioBlob);
      
      if (transcription && this.onTranscriptionUpdate) {
        this.onTranscriptionUpdate(transcription);
      }

      // Limpar chunks processados
      this.audioChunks = [];

    } catch (error) {
      console.error('Erro ao processar áudio:', error);
    }
  }

  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('language', 'pt');
      formData.append('prompt', 'Esta é uma reunião de negócios em português brasileiro sobre consultoria, software e tecnologia.');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.transcription) {
        // Formatar transcrição com timestamps
        const segments = result.transcription.segments || [];
        return segments.map((segment: any) => 
          `${segment.timestamp} ${segment.text}`
        ).join('\n');
      }

      return '';

    } catch (error) {
      console.error('Erro na transcrição:', error);
      return '';
    }
  }

  async generateSummary(transcription: string, meetingContext: string = ''): Promise<string> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription,
          meetingContext
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.summary;
      }

      return 'Não foi possível gerar o resumo.';

    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      return 'Erro ao gerar resumo da reunião.';
    }
  }

  private getFullTranscription(): string {
    // Retornar transcrição completa acumulada
    return this.audioChunks.length > 0 ? 'Transcrição processada com sucesso' : '';
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}