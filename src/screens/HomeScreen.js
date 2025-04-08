import React, { useState } from 'react';
import {
  Text,
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View
} from 'react-native';
import { CalendarIcon, ChevronLeftIcon, Cog6ToothIcon, ListBulletIcon } from 'react-native-heroicons/solid';
import RainbowCalendarScreen from './RainbowCalendarScreen';
import SettingsScreen from './SettingsScreen';
// import RainbowLepreGameScreen from './RainbowLepreGameScreen';

const homeRainbowScreensButtons = [
  {
    rainbowScreen: 'Home',
    rainbowWhiteIcon: <ListBulletIcon size={Dimensions.get('window').height * 0.033} color='white' />,
    rainbowScreenTitle: 'Tracking',
  },
  {
    rainbowScreen: 'Calendar',
    rainbowWhiteIcon: <CalendarIcon size={Dimensions.get('window').height * 0.033} color='white' />,
    rainbowScreenTitle: 'Calendar',
  },
  // {
  //   rainbowScreen: 'Game',
  //   rainbowWhiteIcon: require('../assets/icons/rainbowButtons/gameIcon.png'),
  //   rainbowScreenTitle: 'Game',
  // },
  {
    rainbowScreen: 'Settings',
    rainbowWhiteIcon: <Cog6ToothIcon size={Dimensions.get('window').height * 0.033} color='white' />,
    rainbowScreenTitle: 'Settings',
  },
];

const fontSfProTextRegular = 'SFProText-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedRainbowScreen, setSelectedRainbowScreen] = useState('Home');
  const [isHabitVisible, setIsHabitVisible] = useState(false);

  return (
    <View style={{
      width: dimensions.width,
      alignItems: 'center',
      backgroundColor: 'rgb(15, 135, 49)',
      flex: 1,
    }}>
      <TouchableOpacity style={{
        position: 'absolute',
        width: dimensions.width,
        height: dimensions.height,
        zIndex: 10000,
      }}
        onPress={() => {
          nextAction();
        }}
      >
      </TouchableOpacity>

      <SafeAreaView style={{
        alignSelf: 'center',
        backgroundColor: 'rgba(253, 184, 56, 0.73)',
        alignItems: 'center',
        marginBottom: dimensions.height * 0.01,
        justifyContent: 'center',
        width: dimensions.width,
      }}>

        {isHabitVisible ? (
          <TouchableOpacity
            onPress={() => {
              setIsHabitVisible(false);
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-start',
              paddingHorizontal: dimensions.width * 0.03,
              paddingBottom: dimensions.height * 0.014,
              flexDirection: 'row',
            }}>
            <ChevronLeftIcon size={dimensions.height * 0.034} color='white' />
            <Text style={{
              alignItems: 'center',
              fontWeight: 700,
              fontSize: dimensions.width * 0.061,
              textAlign: 'center',
              alignSelf: 'flex-start',
              color: 'white',
              fontFamily: fontSfProTextRegular,
            }}
            >
              Info
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={{
            paddingBottom: dimensions.height * 0.014,
            alignSelf: 'flex-start',
            textAlign: 'center',
            fontFamily: fontSfProTextRegular,
            fontWeight: 700,
            alignItems: 'center',
            fontSize: dimensions.width * 0.061,
            paddingLeft: dimensions.width * 0.05,
            color: 'white',
          }}
          >
            Habit Tracking
          </Text>
        )}
      </SafeAreaView>
      {selectedRainbowScreen === 'Home' ? (
        <View style={{
          height: dimensions.height,
          width: dimensions.width,
        }}>
          <View style={{
            justifyContent: 'flex-end',
            height: dimensions.height * 0.77,
            alignSelf: 'center',
            width: dimensions.width,
          }}>
            <View style={{
              bottom: dimensions.height * 0,
              position: 'absolute',
              alignSelf: 'center',
              width: dimensions.width * 0.9,
            }}>
              <Text
                style={{
                  bottom: -dimensions.height * 0.07,
                  fontSize: dimensions.width * 0.046,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'white',
                  paddingHorizontal: dimensions.width * 0.08,
                  fontFamily: fontSfProTextRegular,
                }}
              >
                There are no habits here yet, it's time to create one!
              </Text>

              
            </View>
          </View>

          <TouchableOpacity style={{
            position: 'absolute',
            top: dimensions.height * 0.01,
            alignSelf: 'center',
            width: dimensions.width * 0.9,
            height: dimensions.height * 0.07,
            backgroundColor: 'rgba(253, 185, 56, 1)',
            borderRadius: dimensions.width * 0.07,
            justifyContent: 'center',
            alignItems: 'center',
          }}
            onPress={() => {
              setIsHabitVisible(true);
              // nextAction();
            }}
          >
            <Text
              style={{
                fontSize: dimensions.width * 0.046,
                fontWeight: 600,
                textAlign: 'center',
                color: 'black',
                paddingHorizontal: dimensions.width * 0.1,
                fontFamily: fontSfProTextRegular,
              }}
            >
              Create a new habit
            </Text>
          </TouchableOpacity>
        </View>
      ) : selectedRainbowScreen === 'LoadingRainbow' ? (
        <LoadingRainbowStreakScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} />
      ) : selectedRainbowScreen === 'Calendar' ? (
        <RainbowCalendarScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} />
      ) : selectedRainbowScreen === 'Settings' ? (
        <SettingsScreen setSelectedRainbowScreen={setSelectedRainbowScreen} 
        />
      ) : null}

      {selectedRainbowScreen !== 'LoadingRainbow' && (
        <View
          style={{
            bottom: dimensions.height * 0,
            
            height: dimensions.height * 0.12,
            
            alignSelf: 'center',
            
            backgroundColor: '#b6aa36',
            
            flexDirection: 'row',
            
            width: dimensions.width,
            
            position: 'absolute',
            
            alignItems: 'center',
            
            paddingTop: dimensions.height * 0.015,
            
            justifyContent: 'space-between',
            
            zIndex: 4000,
            
            paddingHorizontal: dimensions.width * 0.05,
            
            paddingBottom: dimensions.height * 0.024,
          }}
        >
          {homeRainbowScreensButtons.map((rainbBtn, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedRainbowScreen(rainbBtn.rainbowScreen)}
              style={{
                shadowColor: 'black',
                
                alignItems: 'center',
                
                height: dimensions.height * 0.088,
                
                marginHorizontal: dimensions.width * 0.001,
                
                backgroundColor: selectedRainbowScreen === rainbBtn.rainbowScreen ? 'rgba(253, 185, 56, 1)' : 'transparent',
                
                borderRadius: dimensions.width * 0.07,
                
                padding: dimensions.height * 0.019,
                
                width: dimensions.width * 0.24,
                
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                
                elevation: 1,
                
                shadowOpacity: 0.18,
                
                shadowRadius: dimensions.width * 0.03,
              }}
            >
              {rainbBtn.rainbowWhiteIcon}
              <Text
                style={{
                  fontWeight: 600,
                  fontFamily: fontSfProTextRegular,
                  marginTop: dimensions.height * 0.004,
                  color: 'white',
                  fontSize: dimensions.width * 0.034,
                }}
              >
                {rainbBtn.rainbowScreenTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
