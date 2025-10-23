import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceAssistantProps {
  sensorData: {
    temperature: number;
    humidity: number;
    gas: number;
    vibration: number;
  };
}

export function VoiceAssistant({ sensorData }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const languageCodeMap: Record<string, string> = {
    en: 'en',
    hi: 'hi',
    gu: 'gu',
    mr: 'mr',
    ta: 'ta',
    te: 'te',
    ml: 'ml',
    pa: 'pa',
    ur: 'ur',
    kn: 'kn',
    bn: 'bn',
  };

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      toast({
        title: t('voiceListening'),
        description: t('voiceListeningDesc'),
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: t('voiceError'),
        description: t('voiceMicError'),
        variant: 'destructive',
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        // Transcribe audio
        const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke(
          'voice-to-text',
          {
            body: { audio: base64Audio, language: languageCodeMap[language] },
          }
        );

        if (transcriptError) throw transcriptError;

        const userText = transcriptData.text;
        setTranscript(userText);

        // Get AI response
        const { data: chatData, error: chatError } = await supabase.functions.invoke(
          'grain-ai-chat',
          {
            body: {
              message: userText,
              sensorData,
              language: language,
            },
          }
        );

        if (chatError) throw chatError;

        const aiReply = chatData.reply;
        setResponse(aiReply);

        // Convert response to speech
        const { data: speechData, error: speechError } = await supabase.functions.invoke(
          'text-to-speech',
          {
            body: { text: aiReply, voice: 'alloy' },
          }
        );

        if (speechError) throw speechError;

        // Play audio response
        playAudio(speechData.audioContent);
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: t('voiceError'),
        description: error.message || t('voiceProcessError'),
        variant: 'destructive',
      });
    }
  };

  const playAudio = (base64Audio: string) => {
    if (!audioRef.current) return;

    const audioBlob = new Blob(
      [Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))],
      { type: 'audio/mp3' }
    );
    const audioUrl = URL.createObjectURL(audioBlob);

    audioRef.current.src = audioUrl;
    audioRef.current.onplay = () => setIsSpeaking(true);
    audioRef.current.onended = () => {
      setIsSpeaking(false);
      URL.revokeObjectURL(audioUrl);
    };
    audioRef.current.play();
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('voiceAssistant')}</h3>
        {isSpeaking && (
          <Button
            variant="outline"
            size="sm"
            onClick={stopSpeaking}
            className="gap-2"
          >
            <VolumeX className="h-4 w-4" />
            {t('voiceStop')}
          </Button>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          variant={isListening ? 'destructive' : 'default'}
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
          className="gap-2 h-20 w-20 rounded-full"
        >
          {isListening ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
      </div>

      {transcript && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t('voiceYouSaid')}:</p>
          <p className="text-sm bg-muted p-3 rounded-md">{transcript}</p>
        </div>
      )}

      {response && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">{t('voiceAssistantReply')}:</p>
          </div>
          <p className="text-sm bg-primary/10 p-3 rounded-md">{response}</p>
        </div>
      )}

      {!transcript && !response && (
        <p className="text-sm text-center text-muted-foreground">
          {t('voiceAssistantDesc')}
        </p>
      )}
    </Card>
  );
}
