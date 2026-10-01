import React from 'react';
import * as RN from 'react-native';

const RNModule = RN as any;
const OriginalText = RNModule.Text;
const OriginalTextInput = RNModule.TextInput;

/**
 * Maps standard CSS / React Native fontWeight to the corresponding
 * @expo-google-fonts/prompt typeface asset.
 */
export function getPromptFontFamily(fontWeight?: string | number): string {
  if (!fontWeight) return 'Prompt_400Regular';
  const weightStr = String(fontWeight).toLowerCase();

  if (weightStr === 'bold' || weightStr === '700') {
    return 'Prompt_700Bold';
  }
  if (weightStr === '800' || weightStr === '900' || weightStr === 'heavy' || weightStr === 'black') {
    return 'Prompt_800ExtraBold';
  }
  if (weightStr === '600' || weightStr === 'semibold') {
    return 'Prompt_600SemiBold';
  }
  if (weightStr === '500' || weightStr === 'medium') {
    return 'Prompt_500Medium';
  }
  if (weightStr === '300' || weightStr === 'light') {
    return 'Prompt_300Light';
  }
  if (weightStr === '100' || weightStr === '200' || weightStr === 'thin' || weightStr === 'ultralight') {
    return 'Prompt_300Light';
  }
  return 'Prompt_400Regular';
}

/**
 * Patched Text component that guarantees the Prompt font is applied across
 * Android, iOS, and Web.
 * 
 * Crucially on Android: Strips `fontWeight` when using custom font assets
 * (Prompt_*), because React Native on Android fails typeface lookup when
 * a numeric or 'bold' fontWeight is specified alongside a custom font family,
 * reverting to the default system font (Roboto).
 */
export const PatchedText = React.forwardRef<any, RN.TextProps>((props, ref) => {
  const flat = RN.StyleSheet.flatten(props.style) || {};
  const isPromptAlready = flat.fontFamily && typeof flat.fontFamily === 'string' && flat.fontFamily.startsWith('Prompt');
  const targetFamily = flat.fontFamily || getPromptFontFamily(flat.fontWeight);

  const cleanStyle = { ...flat, fontFamily: targetFamily };

  if (RN.Platform.OS === 'android' && (isPromptAlready || !flat.fontFamily)) {
    delete cleanStyle.fontWeight;
  }

  return React.createElement(OriginalText, {
    ...props,
    ref,
    style: cleanStyle,
  });
});
(PatchedText as any).displayName = 'PromptText';

/**
 * Patched TextInput component that ensures user inputs also use Prompt.
 */
export const PatchedTextInput = React.forwardRef<any, RN.TextInputProps>((props, ref) => {
  const flat = RN.StyleSheet.flatten(props.style) || {};
  const targetFamily = flat.fontFamily || getPromptFontFamily(flat.fontWeight);

  const cleanStyle = { ...flat, fontFamily: targetFamily };
  if (RN.Platform.OS === 'android') {
    delete cleanStyle.fontWeight;
  }

  return React.createElement(OriginalTextInput, {
    ...props,
    ref,
    style: cleanStyle,
  });
});
(PatchedTextInput as any).displayName = 'PromptTextInput';

// Patch react-native exports dynamically so every `<Text>` in the application
// automatically inherits the Prompt font without manual boilerplate.
try {
  Object.defineProperty(RNModule, 'Text', {
    configurable: true,
    enumerable: true,
    get: () => PatchedText,
  });

  Object.defineProperty(RNModule, 'TextInput', {
    configurable: true,
    enumerable: true,
    get: () => PatchedTextInput,
  });
} catch (e) {
  console.warn('[initTypography] Failed to patch RN.Text getter:', e);
}
