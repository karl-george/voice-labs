'use client';

import TextToSpeechPanel from '@/components/TextToSpeechPanel';
import VoicePreviewPlaceholder from '@/components/VoicePreviewPlaceholder';
import SettingsPanel from '@/components/SettingsPanel';
import TextToSpeechForm, { defaultTTSFormValues } from '@/components/TextToSpeechForm';

const TextToSpeech = () => {
  return (
    <TextToSpeechForm defaultValues={defaultTTSFormValues}>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col">
          <TextToSpeechPanel />
          <VoicePreviewPlaceholder />
        </div>
        <SettingsPanel />
      </div>
    </TextToSpeechForm>
  );
};
export default TextToSpeech;
