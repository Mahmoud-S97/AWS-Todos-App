import React, { JSX, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppIcon from '../Global/AppIcon';
import { formatDate } from '../../utils';
import { APP_THEME } from '../../theme/styles';

type TodoProps = {
    name: string,
    description?: string,
    completed: boolean,
    createdAt: string | Date,
    className?: string,
    onComplete?: () => void,
    onDelete?: () => void
}

const TodoCard = ({ name, description, completed, createdAt, className, onComplete, onDelete }: TodoProps): JSX.Element => {

    const combinedClasses = `flex-row w-full h-[120] p-4 bg-background-glass dark:bg-background-dark border-gray-400 dark:border-gray-700 justify-between items-center rounded-lg mb-[15] ${className ?? ''}`;

    const formattedDate = formatDate(createdAt);

    return (
        <View style={[APP_THEME.mainShadow, { borderWidth: 2 }]} className={combinedClasses}>
            <View className='w-[70%] flex-col items-start justify-center'>
                <Text numberOfLines={2} className={`w-full text-2xl font-bold text-text-dark dark:text-text-light mb-[5] ${completed && 'line-through'}`}>{name}</Text>
                <Text numberOfLines={2} className='w-full text-lg font-[500] text-text-dark dark:text-text-light'>{description}</Text>
            </View>
            <View className='w-[25%] flex-col justify-center items-end'>
                <Text className='w-full text-sm font-[500] text-right text-text-dark dark:text-text-light mb-[8]'>{formattedDate}</Text>
                <View className='w-full flex-row justify-end items-center'>
                    <TouchableOpacity activeOpacity={0.7} disabled={completed} className='w-[30] h-[30] flex-row justify-center items-center me-[8]' onPress={onComplete}>
                        <AppIcon name={completed ? 'check-circle-o' : 'circle-thin'} size={30} className={`${completed ? 'text-gray-100 dark:text-gray-200' : 'text-gray-200'}`} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} className='w-[30] h-[30] flex-row justify-center items-center' onPress={onDelete}>
                        <AppIcon name='trash-o' size={25} className='text-text-dark dark:text-text-light' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default memo(TodoCard);