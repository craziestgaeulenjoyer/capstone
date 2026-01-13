declare module 'react-native-vector-icons/Ionicons';
declare module 'react-native-vector-icons/FontAwesome';
declare module '@react-native-checkbox/checkbox' {
  import * as React from 'react';
  import { ViewStyle, ColorValue } from 'react-native';

  export interface CheckBoxProps {
    value: boolean;
    onValueChange?: (value: boolean) => void;
    disabled?: boolean;
    tintColors?: {
      true?: ColorValue;
      false?: ColorValue;
    };
    onCheckColor?: string;
    onFillColor?: string;
    onTintColor?: string;
    boxType?: 'circle' | 'square';
    style?: ViewStyle;
    animationDuration?: number;
    lineWidth?: number;
    hideBox?: boolean;
    tintColor?: string;
  }

  const CheckBox: React.FC<CheckBoxProps>;
  export default CheckBox;
}

declare module "@ascendtis/react-native-voice-to-text" {
  export function startListening(): Promise<void>;
  export function stopListening(): Promise<void>;
  export function destroy(): Promise<void>;

  export let onSpeechResults: (event: any) => void;
  export let onSpeechError: (event: any) => void;
}
