import React, {JSX, ReactNode} from 'react';
import { View } from 'react-native';

interface MainHeaderTypes {
    children: ReactNode,
    className?: string
}

const MainHeader = ({children, className}: MainHeaderTypes): JSX.Element => {

    const combinedClasses = `w-full h=[70] flex-row items-center justify-between p-5 ${className ?? ''}`;

    return (
        <View className={combinedClasses}>
            {children}
        </View>
    )
}

export default MainHeader;