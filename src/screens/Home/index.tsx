import React, { useEffect, JSX, useContext, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { RootStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../context/AppTheme';


const client = generateClient();

type TodoList = {
    id: string,
    name: string,
    userId: string,
    description?: string,
    completed: boolean,
    createdAt: string | Date
}

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const HomeScreen = (props: Props): JSX.Element => {

    const { appTheme, toggleAppTheme } = useAppTheme();

    const { logout, user } = useContext(AuthContext);

    const [todo, setTodo] = useState<any>({});
    const [todoList, setTodoList] = useState<TodoList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const results = await client.graphql({
                    query: listTodos,
                    variables: { filter: { userId: { eq: user.sub } } }
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
            userId: user.sub,
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
                            userId: user.sub,
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

            const deletedTodo: any = {
                ...todoList?.find(todo => todo.id === todoId)
            }

            setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

            try {
                await client.graphql({
                    query: deleteTodo,
                    variables: { input: { id: todoId } }
                });
            } catch (error) {
                setTodoList(prevTodos => [...prevTodos, deletedTodo]);
                console.log(`Error while deleting todo ID: ${todoId} : `, error);
            }
        }, [todoList]);

    const logoutHandler = async () => {
        try {
            setLoading(true);
            await signOut();
            await logout();
        } catch (error: any) {
            console.log('Error while logging out: ', error);
            Alert.alert('', error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className='flex-1 bg-primary-light dark:bg-primary-dark'>
            <View className='flex-1'>
                <MainHeader className='bg-transparent'>
                    <View className='w-[50] h-[50] justify-center items-center'>
                        <Image style={[APP_THEME.mainShadow, { borderWidth: 2 }]} source={{ uri: user.avatar }} className='w-full h-full bg-gray-400 rounded-full border-gray-400 dark:border-gray-700' />
                    </View>
                    <Text className='font-[600] text-2xl text-text-dark dark:text-text-light ms-[6%]'>My Tasks</Text>
                    <View className='flex-row items-center justify-center'>
                        <TouchableOpacity activeOpacity={0.6} className='w-[40] h-[40] flex-row justify-center items-center bg-gray-200 rounded-full me-[10]' onPress={toggleAppTheme}>
                            <AppIcon fontFamily='MaterialIcons' name={appTheme === 'dark' ? 'light-mode' : 'dark-mode'} className='text-text-dark dark:text-primary-default' />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} className='w-[40] h-[40] flex-row justify-center items-center bg-gray-200 rounded-full' onPress={logoutHandler}>
                            <AppIcon name='power-off' className='text-gray-700' />
                        </TouchableOpacity>
                    </View>
                </MainHeader>
                <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                    <View className='w-[95%] h-[100%] self-center'>
                        <View style={[APP_THEME.mainShadow, { borderWidth: 2 }]} className='w-f h-[130] my-[20] p-5 flex-col justify-center items-center border-gray-400 dark:border-gray-700 rounded-2xl bg-background-light dark:bg-background-dark'>
                            <Text className='text-text-dark dark:text-text-light text-2xl font-[600]'>Welcome back</Text>
                            <Text numberOfLines={2} className='text-primary-default text-2xl capitalize font-bold my-[5] text-center'>{user?.username}</Text>
                            <Text className='text-lg text-text-dark dark:text-text-light font-[500]'>You have <Text className='font-bold text-orange-600'>{todoList.length}</Text> tasks today</Text>
                        </View>
                        <Text className='text-xl text-text-dark dark:text-text-light font-semibold mb-2 mt-1'>{`${todoList.length ? 'Add More Todos?' : 'Start your Todos:'}`}</Text>
                        <TextInput
                            style={[APP_THEME.mainShadow, { borderWidth: 2 }]}
                            className='w-f h-[60] bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light text-lg placeholder:text-text-dark placeholder:dark:text-text-light border-gray-400 dark:border-gray-700 p-[10] rounded-2xl'
                            placeholder='Todo Name...'
                            onChangeText={(value) => setTodoHandler(value, 'name')}
                            value={todo.name}
                            maxLength={40}
                        />
                        <TextInput
                            style={[APP_THEME.mainShadow, { borderWidth: 2 }]}
                            className='w-f h-[100] bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light text-lg placeholder:text-text-dark placeholder:dark:text-text-light border-gray-400 dark:border-gray-700 p-[10] rounded-2xl my-[20]'
                            placeholder='Todo Description...'
                            onChangeText={(value) => setTodoHandler(value, 'description')}
                            value={todo.description}
                            multiline={true}
                            maxLength={100}
                        />
                        <MainButton style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-f bg-primary-default rounded-2xl border-gray-400 dark:border-gray-700 mb-[20]' textClassName='font-bold text-xl text-white' icon={{ name: 'plus', size: 20, className: 'text-white me-3' }} onPress={addTodoHandler}>
                            Add Todo
                        </MainButton>
                        <FlatList
                            data={todoList}
                            keyExtractor={(todo, index) => todo.id || index.toString()}
                            contentContainerClassName='w-full'
                            scrollEnabled={false}
                            renderItem={({ item: todo }) => <TodoCard {...todo} onComplete={() => completeTodoHandler(todo.id)} onDelete={() => deleteTodoHandler(todo.id)} />}
                        />
                    </View>
                </ScrollView>
                {loading && <Spinner />}
            </View>
        </View>
    )
}

export default HomeScreen;