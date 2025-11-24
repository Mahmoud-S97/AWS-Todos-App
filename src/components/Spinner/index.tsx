import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { getScreenHeight, getScreenWidth } from '../../utils';

const Spinner = () => {
    return (
        <View style={[StyleSheet.absoluteFill, styles.screen]}>
            <ActivityIndicator size='large' color={'orange'} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        width: getScreenWidth(),
        height: getScreenHeight(),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 99999
    }
});

export default Spinner;