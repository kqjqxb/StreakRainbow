import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Linking,
    Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BellIcon, ChevronRightIcon } from 'react-native-heroicons/solid';

const fontSfProTextRegular = 'SFProText-Regular';

const TermsAndPrivacyRainbowBtns = [
    {
        id: 2,
        rainbBtnTitle: 'Privacy Policy',
        rainbBtnLink: '',
        rainbBtnImage: require('../assets/images/settingsImages/privacyImage.png'),
    },
    {
        id: 1,
        rainbBtnTitle: 'Terms of Use',
        rainbBtnLink: '',
        rainbBtnImage: require('../assets/images/settingsImages/termsOfUseImage.png'),
    },
]

const SettingsScreen = ({ selectedRainbowScreen, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isRainbowNotificationEnabled, setRainbowNotificationEnabled] = useState(true);

    const toggleRainbNotificationSwitch = () => {
        const newValue = !isRainbowNotificationEnabled;
        setRainbowNotificationEnabled(newValue);
        saveRainbowSettings('isRainbowNotificationEnabled', newValue);
    };
    const saveRainbowSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving rainbow settings:", error);
        }
    };

    return (
        <View style={{
            width: '100%',
            flex: 1,
            zIndex: 1,
            width: dimensions.width,
            alignItems: 'center',
            position: 'relative',
            justifyContent: 'flex-start',
        }}>

            <View style={{
                justifyContent: 'space-between',
                borderRadius: dimensions.width * 0.034,
                flexDirection: 'row',
                width: dimensions.width * 0.93,
                paddingHorizontal: dimensions.width * 0.04,
                alignSelf: 'center',
                paddingVertical: dimensions.height * 0.019,
                marginBottom: dimensions.height * 0.008,
                alignItems: 'center',
                backgroundColor: 'rgba(253, 185, 56, 1)',
                borderRadius: dimensions.width * 0.666,
            }}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <BellIcon size={dimensions.height * 0.03} color='white' />
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: 400,
                            fontSize: dimensions.width * 0.043,
                            marginLeft: dimensions.width * 0.03,
                            textAlign: 'center',
                            fontFamily: fontSfProTextRegular,
                        }}>
                        Notifications
                    </Text>
                </View>
                <Switch
                    trackColor={{ false: '#948ea0', true: 'rgba(26, 172, 75, 1)' }}
                    thumbColor={'white'}
                    ios_backgroundColor="#3E3E3E"
                    onValueChange={toggleRainbNotificationSwitch}
                    value={isRainbowNotificationEnabled}
                />
            </View>

            {TermsAndPrivacyRainbowBtns.map((button) => (
                <TouchableOpacity
                    key={button.id}
                    onPress={() => {
                        Linking.openURL(button.rainbBtnLink);
                    }}
                    style={{
                        justifyContent: 'space-between',
                        borderRadius: dimensions.width * 0.034,
                        flexDirection: 'row',
                        width: dimensions.width * 0.93,
                        paddingHorizontal: dimensions.width * 0.04,
                        alignSelf: 'center',
                        paddingVertical: dimensions.height * 0.019,
                        marginBottom: dimensions.height * 0.008,
                        alignItems: 'center',
                        backgroundColor: 'rgba(253, 185, 56, 1)',
                        borderRadius: dimensions.width * 0.666,

                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* <Image
                            source={button.rainbBtnImage}
                            style={{
                                height: dimensions.height * 0.03,
                                width: dimensions.height * 0.03,
                            }}
                            resizeMode='contain'
                        /> */}
                        <Text
                            style={{
                                textAlign: 'center',
                                color: 'white',
                                fontFamily: fontSfProTextRegular,
                                fontSize: dimensions.width * 0.043,
                                fontWeight: 400,
                            }}>
                            {button.rainbBtnTitle}
                        </Text>
                    </View>
                    <ChevronRightIcon size={dimensions.height * 0.03} color='white' />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SettingsScreen;