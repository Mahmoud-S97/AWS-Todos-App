import React, { useEffect, JSX, useContext, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, TextInput, ImageBackground } from 'react-native';
import { signOut } from 'aws-amplify/auth';
import { AuthContext } from '../../context/Auth';
import MainHeader from '../../components/Global/MainHeader';
import AppIcon from '../../components/Global/AppIcon';
import { APP_THEME } from '../../theme/styles';
import MainButton from '../../components/Global/MainButton';
import { generateClient, GraphQLResult } from '@aws-amplify/api';
import { createTodo, deleteTodo, updateTodo } from '../../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../../components/Spinner';
import { listTodos } from '../../graphql/queries';
import TodoCard from '../../components/TodoCard';
import { LOCAL_IMAGES } from '../../constants';


const client = generateClient();

type TodoList = {
    id: string,
    name: string,
    description?: string,
    completed: boolean,
    createdAt: string | Date
}

const HomeScreen = (props: any): JSX.Element => {

    const { logout, user } = useContext(AuthContext);

    const [todo, setTodo] = useState<any>({});
    const [todoList, setTodoList] = useState<TodoList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const results = await client.graphql({
                    query: listTodos
                }) as GraphQLResult<any>;
                const { data } = results;
                if (data?.listTodos?.items?.length) {
                    setTodoList(data.listTodos.items);
                }
            } catch (error) {
                console.log('Error while getting Todos: ', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const setTodoHandler = useCallback((value: string, inputField: string) => {
        setTodo((prevTodo: any) => ({ ...prevTodo, [inputField]: value }));
    }, [todo]);

    const addTodoHandler = useCallback(async () => {

        if (!todo?.name?.trim()) {
            Alert.alert('', 'Todo name is required');
            return;
        }
        const newTodoId = uuidv4();
        const addedTodo = {
            id: newTodoId,
            name: todo.name,
            description: todo?.description || '',
            completed: false
        }

        setTodoList(prevTodos => [...prevTodos, { ...addedTodo, createdAt: new Date() }]);

        try {

            setLoading(true);
            await client.graphql({
                query: createTodo,
                variables: { input: addedTodo }
            });

        } catch (error) {
            setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== newTodoId));
            console.log('Error while creating Todo: ', error);
        } finally {
            setLoading(false);
            setTodo({});
        }
    }, [todo]);

    const completeTodoHandler = useCallback(
        async (todoId: string): Promise<void> => {

            setTodoList(prevTodos => prevTodos.map(todo => todo.id === todoId ? { ...todo, completed: true } : todo));

            try {

                await client.graphql({
                    query: updateTodo,
                    variables: {
                        input: {
                            id: todoId,
                            completed: true
                        }
                    }
                });

            } catch (error) {
                setTodoList(prevTodos => prevTodos.map(todo => todo.id === todoId ? { ...todo, completed: false } : todo));
                console.log(`Error while updating todo ID: ${todoId} : `, error);
            }
        }, [todoList]);

    const deleteTodoHandler = useCallback(
        async (todoId: string): Promise<void> => {

            setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

            try {
                await client.graphql({
                    query: deleteTodo,
                    variables: { input: { id: todoId } }
                });
            } catch (error) {
                setTodoList(prevTodos => prevTodos.map(todo => todo.id === todoId ? { ...todo, completed: false } : todo));
                console.log(`Error while deleting todo ID: ${todoId} : `, error);
            }
        }, [todoList]);

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
            <ImageBackground className='flex-1' source={LOCAL_IMAGES.HOME_BACKGROUND_IMG} resizeMode='cover'>
                <MainHeader className='bg-orange-400'>
                    <View className='w-[50] h-[50] justify-center items-center'>
                        <Image style={[APP_THEME.mainShadow, { borderWidth: 2 }]} source={{ uri: user.avatar }} className='w-full h-full bg-gray-400 rounded-full border-gray-400' />
                    </View>
                    <Text className='font-[600] text-2xl text-white ms-[6%]'>My Tasks</Text>
                    <View className='flex-row items-center justify-center'>
                        <TouchableOpacity activeOpacity={0.6} className='w-[40] h-[40] flex-row justify-center items-center bg-gray-200 rounded-full me-[10]'>
                            <AppIcon fontFamily='MaterialIcons' name='light-mode' className='text-gray-700' />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} className='w-[40] h-[40] flex-row justify-center items-center bg-gray-200 rounded-full' onPress={logoutHandler}>
                            <AppIcon name='power-off' className='text-gray-700' />
                        </TouchableOpacity>
                    </View>
                </MainHeader>
                <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                    <View className='w-[95%] h-[100%] self-center'>
                        <View style={[APP_THEME.mainShadow, { borderWidth: 2 }]} className='w-f h-[130] my-[20] p-5 flex-col justify-center items-center border-gray-400 rounded-2xl bg-white'>
                            <Text className='text-gray-800 text-2xl font-[600]'>Welcome back</Text>
                            <Text numberOfLines={2} className='text-orange-400 text-2xl capitalize font-bold my-[5] text-center'>{user?.username}</Text>
                            <Text className='text-lg color-gray-900 font-[500]'>You have <Text className='font-bold text-orange-600'>{todoList.length}</Text> tasks today</Text>
                        </View>
                        <Text className='text-xl text-black font-semibold mb-2 mt-1'>Add More Todos?</Text>
                        <TextInput
                            style={[APP_THEME.mainShadow, { borderWidth: 2 }]}
                            className='w-f h-[60] bg-white text-black text-lg border-gray-400 p-[10] rounded-2xl'
                            placeholder='Todo Name...'
                            placeholderTextColor={'#444444'}
                            onChangeText={(value) => setTodoHandler(value, 'name')}
                            value={todo.name}
                            maxLength={40}
                        />
                        <TextInput
                            style={[APP_THEME.mainShadow, { borderWidth: 2 }]}
                            className='w-f h-[100] bg-white text-black text-lg border-gray-400 p-[10] rounded-2xl my-[20]'
                            placeholder='Todo Description...'
                            placeholderTextColor={'#444444'}
                            onChangeText={(value) => setTodoHandler(value, 'description')}
                            value={todo.description}
                            multiline={true}
                            maxLength={100}
                        />
                        <MainButton style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-f bg-orange-400 rounded-2xl border-gray-400 mb-[20]' textClassName='font-bold text-xl text-white' icon={{ name: 'plus', size: 20, className: 'text-white me-3' }} onPress={addTodoHandler}>
                            Add Todo
                        </MainButton>
                        {todoList.map((todo, index) => <TodoCard key={index} {...todo} onComplete={() => completeTodoHandler(todo.id)} onDelete={() => deleteTodoHandler(todo.id)} />)}
                    </View>
                </ScrollView>
                {loading && <Spinner />}
            </ImageBackground>
        </View>
    )
}

export default HomeScreen;