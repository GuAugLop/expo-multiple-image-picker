import React from 'react';
import { FlatList } from 'react-native-gesture-handler';

import * as MediaLibrary from 'expo-media-library';
import ImageCard from './components/ImageCard';

export const ImageBrowser: React.FC = () => {
  const [assets, setAssets] = React.useState<MediaLibrary.Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = React.useState<string[]>([]);
  const [after, setAfter] = React.useState<MediaLibrary.AssetRef>();
  const [next, setNext] = React.useState(true);

  React.useEffect(() => {
    initialRender();
  }, []);

  // Funções executadas ao renderizar o componente
  async function initialRender() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        getPhotos(after);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Função para ler as fotos do usuário
  const getPhotos = React.useCallback(
    async (after) => {
      try {
        if (!next) {
          return;
        }
        const result = await MediaLibrary.getAssetsAsync({
          sortBy: MediaLibrary.SortBy.creationTime,
          mediaType: 'photo',
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
        selectedIndex={selectedAssets.indexOf(item.uri)}
      />
    ),
    [selectedAssets]
  );

  const keyExtractor = React.useCallback((item) => item.id, []);

  React.useEffect(() => {
    getPhotos(after);
  }, []);

  const onClickUseCallBack = React.useCallback((image: string) => {
    setSelectedAssets((selectedAssets) => {
      const alreadySelected = selectedAssets.indexOf(image) >= 0;
      if (selectedAssets.length >= 10 && !alreadySelected)
        return selectedAssets;
      if (alreadySelected)
        return selectedAssets.filter((item) => item !== image);
      else return [...selectedAssets, image];
    });
  }, []);

  return (
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
  );
};
