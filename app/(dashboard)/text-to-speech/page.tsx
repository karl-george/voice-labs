import { Metadata } from 'next';
import TextToSpeech from '@/components/TextToSpeech';

export const metadata: Metadata = {
  title: 'Text to Speech',
};

const TextToSpeechPage = () => {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <TextToSpeech />
    </div>
  );
};
export default TextToSpeechPage;
