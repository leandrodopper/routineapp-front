import React from 'react'
import { Image, View } from 'react-native';

export const PersonLogo = () => {
  return (
    <View style={{
        alignItems:'center'
    }}>
        <Image 
            source={ require('../assets/person.png')}
            style={{
                width:200,
                height:190,
            }}
        />

    </View>
  )
}