import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const MainHeader = () => {
    return (
        <View style={styles}>
            <TouchableOpacity>
                <Text>{'<'}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    
})

export default MainHeader;