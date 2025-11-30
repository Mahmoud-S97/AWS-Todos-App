import React, { JSX, ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { cssInterop } from 'nativewind';
import AppIcon from '../AppIcon';

cssInterop(TouchableOpacity, {className: 'style'} )

type IconTypes = {
    fontFamily?: 'FontAwesome' | 'MaterialIcons' | 'Ionicons',
    name: string;
    size?: number;
    color?: string;
    className?: string;
}

type MainButtonTypes = {
    children: ReactNode,
    style?: any,
    icon?: IconTypes,
    className?: string,
    textClassName?: string,
    onPress?: () => void
}

const MainButton = ({ children, style, className, icon, textClassName, onPress }: MainButtonTypes): JSX.Element => {
    console.log('className: ', className);

    const combinedClasses = `h-[50] flex-row items-center justify-center ${className ?? ''}`;
    const combinedTextClasses = `font-[500] text-gray-700 ${textClassName ?? ''}`;


    return (
        <TouchableOpacity activeOpacity={0.6} className={combinedClasses} style={style} onPress={onPress}>
            {icon && (
                <AppIcon {...icon} />
            )}
            <Text className={combinedTextClasses}>{children}</Text>
        </TouchableOpacity>
    )
}

export default MainButton;