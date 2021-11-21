import React, { memo } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/solid';

import { RectButton } from 'react-native-gesture-handler';
import { ItemType } from '../Types';

const ImageCard: React.FC<ItemType> = ({
  image,
  selectedIndex,
  onClick,
}) => {
  const handleClick = () => {
    onClick(image);
  };

  return (
    <RectButton style={styles.container} onPress={handleClick}>
      <Image source={{ uri: image }} style={[styles.image]} />
      {selectedIndex >= 0 && (
        <View style={styles.selected}>
          <CheckIcon size={50} color="#fff" />
        </View>
      )}
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width / 3 - 4,
    height: Dimensions.get('screen').width / 3 - 4,
    margin: 2,
  },
  image: {
    flex: 1,
    backgroundColor: '#dbdbdb',
    resizeMode: 'cover',
  },
  selected: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ImageCard);
