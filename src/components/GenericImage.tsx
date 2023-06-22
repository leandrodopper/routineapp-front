import React from 'react'
import { Image, View } from 'react-native';

export const GenericImage = () => {
  return (
    <View style={{
        alignItems:'center'
    }}>
        <Image 
            source={ require('../assets/generic.png')}
            style={{
                width:110,
                height:100,
            }}
        />

    </View>
  )
}
