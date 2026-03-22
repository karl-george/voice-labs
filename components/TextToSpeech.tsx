import TextToSpeechPanel from '@/components/TextToSpeechPanel';
import VoicePreviewPlaceholder from '@/components/VoicePreviewPlaceholder';
import SettingsPanel from '@/components/SettingsPanel';

const TextToSpeech = () => {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col">
        <TextToSpeechPanel />
        <VoicePreviewPlaceholder />
      </div>
      <SettingsPanel />
    </div>
  );
};
export default TextToSpeech;
