import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../assets/linkfyLogo.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
   
  },
})
