import React from 'react';
import { FlatList, RectButton } from 'react-native-gesture-handler';

import * as MediaLibrary from 'expo-media-library';
import ImageCard from './components/ImageCard';

import { ImageMultiplePickerPropTypes } from './Types';
import { StyleSheet } from 'react-native';

import { CheckIcon } from 'react-native-heroicons/solid';

const ImageMultiplePicker: React.FC<ImageMultiplePickerPropTypes> = ({
  selectedAssets,
  setSelectedAssets,
  confirmCallback,
  confirmButtonColor,
  confirmIconColor,
  max = 10,
  min = 1,
}) => {
  const [assets, setAssets] = React.useState<MediaLibrary.Asset[]>([]);
  const [after, setAfter] = React.useState<MediaLibrary.AssetRef>();
  const [next, setNext] = React.useState(true);
  const [currentSelected, setCurrentSelected] =
    React.useState<string[]>(selectedAssets);

  // Função para ler as fotos do usuário
  const getPhotos = React.useCallback(
    async (after) => {
      try {
        if ((await MediaLibrary.requestPermissionsAsync()).status !== 'granted') {
          throw new Error('Permission not agreed');
        }
        if (!next) {
          return;
        }
        const result = await MediaLibrary.getAssetsAsync({
          sortBy: MediaLibrary.SortBy.creationTime,
          mediaType: 'photo',
          first:50,
          after: after,
        });
        const newAssets = [...assets, ...result.assets];
        setAssets(newAssets);

        setNext(result.hasNextPage);
        setAfter(result.endCursor);
      } catch (err) {
        console.log(err);
      }
    },
    [after]
  );

  const renderItem = React.useCallback(
    ({ item }) => (
      <ImageCard
        onClick={onClickUseCallBack}
        id={item.id}
        image={item.uri}
        selectedIndex={currentSelected.indexOf(item.uri)}
      />
    ),
    [currentSelected]
  );

  const keyExtractor = React.useCallback((item) => item.id, []);

  React.useEffect(() => {
    getPhotos(after);
  }, []);

  const handleConfirmSelections = () => {
    setSelectedAssets(currentSelected);
    confirmCallback && confirmCallback(false);
  };

  const onClickUseCallBack = React.useCallback((image: string) => {
    //@ts-ignore
    setCurrentSelected((currentSelected: string[]) => {
      const alreadySelected = currentSelected.indexOf(image) >= 0;
      if (currentSelected.length >= max && !alreadySelected)
        return currentSelected;
      if (alreadySelected)
        return currentSelected.filter((item: string) => item !== image);
      else return [...currentSelected, image];
    });
  }, []);

  return (
    <>
      <FlatList
        onEndReached={() => getPhotos(after)}
        onEndReachedThreshold={0.5}
        keyExtractor={keyExtractor}
        initialNumToRender={50}
        numColumns={3}
        data={assets}
        extraData={selectedAssets}
        renderItem={renderItem}
      />
      {currentSelected.length >= min && (
        <RectButton
          style={[
            styles.button,
            { backgroundColor: confirmButtonColor || '#091d4f' },
          ]}
          onPress={handleConfirmSelections}
        >
          <CheckIcon style={styles.check} color={confirmIconColor || '#fff'} />
        </RectButton>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 40,
    bottom: 30,
    right: 30,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {},
});

const ImageMultiplePickerMemoized = React.memo(ImageMultiplePicker);

export { ImageMultiplePickerMemoized };
