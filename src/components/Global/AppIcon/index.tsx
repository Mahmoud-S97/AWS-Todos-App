import React, { memo, Suspense } from 'react';
import { View } from 'react-native';
import { cssInterop } from 'nativewind';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

cssInterop(FontAwesome, { className: 'style' });
cssInterop(MaterialIcons, { className: 'style' });
cssInterop(Ionicons, { className: 'style' });

type FontFamily =
    | 'Ionicons'
    | 'FontAwesome'
    | 'MaterialIcons';

interface AppIconProps {
    fontFamily?: FontFamily;
    name: string;
    size?: number;
    color?: string;
    className?: string;
}

const loadFont = (fontLibrary: FontFamily) => {
    switch (fontLibrary) {
        case 'FontAwesome':
            return require('react-native-vector-icons/FontAwesome').default
        case 'Ionicons':
            return require('react-native-vector-icons/Ionicons').default
        case 'MaterialIcons':
            return require('react-native-vector-icons/MaterialIcons').default
        default:
            return require('react-native-vector-icons/FontAwesome').default
    }
}

const AppIcon = ({ fontFamily = 'FontAwesome', name, size = 24, color, className }: AppIconProps) => {

    const Icon = loadFont(fontFamily);
    return (
        <Suspense fallback={<View />}>
            <Icon name={name} size={size} color={color} className={className} />
        </Suspense>
    )
}

export default memo(AppIcon);