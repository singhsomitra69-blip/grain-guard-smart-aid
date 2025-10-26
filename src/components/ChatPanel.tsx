import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatPanelProps {
  sensorData: {
    temperature: number;
    humidity: number;
    gas: number;
    vibration: number;
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatPanel({ sensorData }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' },
      });

      if (error) throw error;

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audioRef.current = audio;
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('grain-ai-chat', {
        body: {
          message: userMessage,
          sensorData,
          language,
        },
      });

      if (error) throw error;

      const assistantMessage = data.reply;
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      
      // Speak the AI response
      await playAudio(assistantMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: t('voiceError'),
        description: error instanceof Error ? error.message : t('voiceProcessError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="p-6 space-y-4 h-[500px] flex flex-col">
      <h3 className="text-lg font-semibold">{t('chatPanel')}</h3>
      
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-sm text-center text-muted-foreground py-8">
              <p>{t('chatPanelDesc')}</p>
              <div className="mt-4 space-y-2">
                <p className="font-semibold">{t('chatCommands')}:</p>
                <ul className="text-xs space-y-1">
                  <li>• "{t('chatCommandTemp')}"</li>
                  <li>• "{t('chatCommandGas')}"</li>
                  <li>• "{t('chatCommandHumidity')}"</li>
                  <li>• "{t('chatCommandStatus')}"</li>
                </ul>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chatPlaceholder')}
          className="resize-none"
          rows={2}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-full"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}
