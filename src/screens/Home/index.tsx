import React, { useEffect, JSX, useContext, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, TextInput } from 'react-native';
import { signOut } from 'aws-amplify/auth';
import { AuthContext } from '../../context/Auth';
import MainHeader from '../../components/Global/MainHeader';
import AppIcon from '../../components/Global/AppIcon';
import { APP_THEME } from '../../theme/styles';
import MainButton from '../../components/Global/MainButton';

type TodoList = {
    id: string,
    name: string,
    description: string,
    completed: boolean
}

const HomeScreen = (props: any): JSX.Element => {

    const { logout, user } = useContext(AuthContext);

    const [todo, setTodo] = useState<any>({});
    const [todoList, setTodoList] = useState<TodoList[]>([]);

    const setTodoHandler = useCallback((value: string, inputField: string) => {
        setTodo((prevTodo: any) => ({ ...prevTodo, [inputField]: value }));
    }, [todo]);

    const addTodoHandler = useCallback(() => {

        if (!todo?.name?.trim() || !todo?.description?.trim()) return;

        const addedTodo = {
            id: new Date().toTimeString(),
            name: todo.name,
            description: todo.description,
            completed: false
        }

        setTodoList(prevTodos => [...prevTodos, addedTodo]);
    }, [todo]);

    const logoutHandler = async () => {
        try {
            await signOut();
            await logout();
        } catch (error: any) {
            console.log('Error while logging out: ', error);
            Alert.alert('', error.message);
        }
    }

    return (
        <View className='flex-1'>
            <MainHeader className='bg-orange-400'>
                <View className='w-[50] h-[50] justify-center items-center'>
                    <Image style={[APP_THEME.mainShadow, { borderWidth: 2 }]} source={{ uri: user.avatar }} className='w-full h-full bg-gray-400 rounded-full border-gray-400' />
                </View>
                <Text className='font-[600] text-2xl text-white ms-[6%]'>My Todos</Text>
                <View className='flex-row items-center justify-center'>
                    <TouchableOpacity activeOpacity={0.6} className='w-[40] h-[40] flex-row justify-center items-center bg-gray-200 rounded-full me-[10]'>
                        <AppIcon fontFamily='MaterialIcons' name='light-mode' className='text-gray-700' />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} className='w-[40] h-[40] flex-row justify-center items-center bg-gray-200 rounded-full' onPress={logoutHandler}>
                        <AppIcon name='power-off' className='text-gray-700' />
                    </TouchableOpacity>
                </View>
            </MainHeader>
            <ScrollView className='w-f h-f bg-gray-200' showsHorizontalScrollIndicator={false}>
                <View className='w-[95%] h-[100%] self-center'>
                    <View style={[APP_THEME.mainShadow, { borderWidth: 2 }]} className='w-f h-[120] my-[20] flex-col justify-center items-center border-gray-400 rounded-2xl bg-gray-300'>
                        <Text className='text-gray-800 text-2xl font-[600]'>Welcome back</Text>
                        <Text className='text-orange-400 text-2xl font-bold mt-[10]'>{user?.username}</Text>
                    </View>
                    <TextInput
                        style={[APP_THEME.mainShadow, { borderWidth: 2 }]}
                        className='w-f h-[60] bg-gray-200 text-black text-lg border-gray-400 p-[10] rounded-2xl'
                        placeholder='Todo Name...'
                        placeholderTextColor={'#444444'}
                        onChangeText={(value) => setTodoHandler(value, 'name')}
                        value={todo}
                        maxLength={40}
                    />
                    <TextInput
                        style={[APP_THEME.mainShadow, { borderWidth: 2 }]}
                        className='w-f h-[100] bg-gray-200 text-black text-lg border-gray-400 p-[10] rounded-2xl my-[20]'
                        placeholder='Todo Description...'
                        placeholderTextColor={'#444444'}
                        onChangeText={(value) => setTodoHandler(value, 'description')}
                        value={todo}
                        multiline={true}
                        maxLength={100}
                    />
                    <MainButton style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-f bg-orange-400 rounded-2xl border-gray-400 mb-[20]' textClassName='font-bold text-xl text-white' icon={{ name: 'plus', size: 20, className: 'text-white me-3' }} onPress={addTodoHandler}>
                        Add Todo
                    </MainButton>
                    {todoList.map((todo, index) => <Text key={index} className='font-bold color-green-400 me-[5] my-[2]'>{todo.name} - {todo.description}</Text>)}
                </View>
            </ScrollView>
        </View>
    )
}

export default HomeScreen;