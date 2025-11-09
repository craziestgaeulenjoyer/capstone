import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Choice'>;

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    image: require('../../assets/MiAmore2.png'),
    title: 'All Your Favorite Flavors',
    description: 'From comforting brews to delicious bites, Mi Amore Cafe brings you the flavors you love, made fresh every day!',
  },
  {
    key: '2',
    image: require('../../assets/MiAmore2.png'),
    title: 'Crafted With Care',
    description: 'Every cup is crafted with passion and care, using the finest ingredients.',
  },
  {
    key: '3',
    image: require('../../assets/MiAmore2.png'),
    title: 'A Place to Unwind',
    description: 'Whether you’re working or relaxing, Mi Amore is your cozy go-to spot.',
  },
];

const SelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <View style={styles.container}>
      {/* Top-right logo */}
      <Image
        source={require('../../assets/MiAmore2.png')}
        style={styles.logo}
      />

      {/* Centered Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={slides}
          ref={flatListRef}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.image} style={styles.slideImage} />
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideDescription}>{item.description}</Text>
            </View>
          )}
        />

        {/* Dot Indicators */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 10,
    right: 20,
    resizeMode: 'contain',
  },
  carouselContainer: {
    marginTop: height * 0.18,
    height: height * 0.45,
    justifyContent: 'center',
  },
  slide: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slideImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#86b662',
    textAlign: 'center',
    marginBottom: 10,
  },
  slideDescription: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#86b662',
  },
  button: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderColor: '#86b662',
    borderWidth: 1.5,
    alignItems: 'center',
    backgroundColor: '#86b662',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    elevation: 3,
  },
});

export default SelectionScreen;
