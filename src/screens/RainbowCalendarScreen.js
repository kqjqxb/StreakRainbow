import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/solid';

const fontSfProTextRegular = 'SFProText-Regular';

const rainbowColors = [
  { color: '#EA0200', name: 'Red' },
  { color: '#FF6600', name: 'Orange' },
  { color: '#FDB938', name: 'Yellow' },
  { color: '#1AAC4B', name: 'Green' },
  { color: '#00AAFF', name: 'Blue' },
  { color: '#001AFF', name: 'Indigo' },
  { color: '#9100FF', name: 'Violet' },
]

const formatRainbowDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatRainbowHeaderDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const RainbowCalendarScreen = ({ selectedRainbowScreen, setSelectedRainbowScreen, setIsCalendarVisible, setIsEditindTodayRelfection }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedRainbowDate, setSelectedRainbowDate] = useState(formatRainbowDate(new Date()));
  const [rainbowToday, setRainbowToday] = useState(formatRainbowDate(new Date()));

  const [selectedSortItem, setSelectedSortItem] = useState('Week');
  const [rainbowHabbits, setRainbowHabbits] = useState([]);
  const [selectedRainbowCalendarDay, setSelectedRainbowCalendarDay] = useState(new Date());
  const [rainbowSeries, setRainbowSeries] = useState(0);

  useEffect(() => {
    const loadRainbowSeries = async () => {
      try {
        const storedSeries = await AsyncStorage.getItem('rainbowSeries');
        if (storedSeries !== null) {
          setRainbowSeries(parseInt(storedSeries, 10));
        }
      } catch (error) {
        console.error('Error loading rainbowSeries', error);
      }
    };

    loadRainbowSeries();
  }, []);

  useEffect(() => {
    const loadCalendarRainbowHabbits = async () => {
      try {
        const existingCalendarRainbowHabbits = await AsyncStorage.getItem('rainbowHabbits');
        if (existingCalendarRainbowHabbits) {
          setRainbowHabbits(JSON.parse(existingCalendarRainbowHabbits));
        }
      } catch (error) {
        console.error('Error loading CalendarRainbowHabbits', error);
      }
    };

    loadCalendarRainbowHabbits();
  }, [rainbowHabbits, selectedRainbowScreen]);


  useEffect(() => {
    const scheduleRainbowReset = () => {
      const now = new Date();
      const nextRainbowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeout = nextRainbowMidnight - now;
      const timer = setTimeout(() => {
        scheduleRainbowReset();
      }, timeout);
      return () => clearTimeout(timer);
    };

    const cleanup = scheduleRainbowReset();
    return cleanup;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentRainbowToday = formatRainbowDate(new Date());
      if (currentRainbowToday !== rainbowToday) {
        setRainbowToday(currentRainbowToday);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [rainbowToday]);

  const markedRainbowDates = useMemo(() => {
    const marks = {
      [rainbowToday]: {
        selected: selectedRainbowDate === rainbowToday,
        selectedColor: '#F9CF22',
        textColor: '#F9CF22',
      },
    };

    if (selectedRainbowDate && selectedRainbowDate !== rainbowToday) {
      marks[selectedRainbowDate] = {
        ...(marks[selectedRainbowDate] || {}),
        selected: true,
        selectedColor: '#F9CF22',
        textColor: '#1AAC4B',
        alignItems: 'center',
        justifyContent: 'center',
      };
    }

    return marks;
  }, [rainbowToday, selectedRainbowDate]);

  const handleRainbowDayPress = (day) => {
    setSelectedRainbowCalendarDay(new Date(day.dateString));
    setSelectedRainbowDate(day.dateString);
  };

  const [weekStart, setWeekStart] = useState(() => {
    const rainbowToday = new Date();
    const day = rainbowToday.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(rainbowToday);
    monday.setDate(rainbowToday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return {
        date,
        day: date.getDate(),
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      };
    });
  }, [weekStart]);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const headerText = `${weekStart.getDate()} - ${weekEnd.getDate()} ${weekEnd.toLocaleString('default', { month: 'long' })}`;

  const habitsForSelectedDay = rainbowHabbits
    .filter(habit => {
      const habitDay = new Date(habit.date);
      habitDay.setHours(0, 0, 0, 0);
      const selectedDayOnly = new Date(selectedRainbowCalendarDay);
      selectedDayOnly.setHours(0, 0, 0, 0);

      if (habitDay.getTime() > selectedDayOnly.getTime()) return false;
      if (habit.status === 'done') return false;
      if (habit.skipBy && habit.skipBy.trim() !== '') {
        const selectedWeekday = selectedRainbowCalendarDay.toLocaleDateString('en-US', { weekday: 'long' });
        if (selectedWeekday === habit.skipBy) return false;
      }
      return true;
    })
    .slice(0, 3);

  return (
    <View style={{
      justifyContent: 'flex-start',
      position: 'relative',
      flex: 1,
      alignItems: 'center',
      width: dimensions.width,
    }} >
      {/* <SafeAreaView style={{
        backgroundColor: '#1AAC4B',
        alignSelf: 'center',
        marginBottom: dimensions.height * 0.01,
        width: dimensions.width,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          paddingBottom: dimensions.height * 0.014,
          textAlign: 'center',
          fontFamily: fontSfProTextRegular,
          color: 'white',
          fontSize: dimensions.width * 0.061,
          alignItems: 'center',
          alignSelf: 'flex-start',
          paddingLeft: dimensions.width * 0.05,
          fontWeight: 700,
        }}
        >
          Meal planner
        </Text>
      </SafeAreaView> */}

      <View style={{
        marginTop: dimensions.height * 0.01,
        alignSelf: 'center',
        flexDirection: 'row',
        paddingHorizontal: dimensions.width * 0.01,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: dimensions.width * 0.5,
        height: dimensions.height * 0.05,
        // backgroundColor: '#1AAC4B',
        backgroundColor: 'rgba(253, 184, 56, 0.73)',
        width: dimensions.width * 0.93,
      }}>
        {['Week', 'Month'].map((item, index) => (
          <TouchableOpacity
            onPress={() => setSelectedSortItem(item)}
            key={index}
            style={{
              width: dimensions.width * 0.44,
              borderRadius: dimensions.width * 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedSortItem === item ? 'rgba(253, 185, 56, 1)' : 'transparent',
              height: dimensions.height * 0.04,
            }}>
            <Text style={{
              fontWeight: 600,
              textAlign: 'center',
              color: 'white',
              shadowColor: 'rgba(0, 0, 0, 0.25)',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 1,
                shadowRadius: 3.84,
                elevation: 5,
              fontSize: dimensions.width * 0.037,
              alignItems: 'center',
              alignSelf: 'center',
              fontFamily: fontSfProTextRegular,
            }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: dimensions.height * 0.16,
          alignSelf: 'center',

        }}
      >
        {selectedSortItem === 'Week' ? (
          <>
            <View style={{
              marginTop: dimensions.height * 0.014,
              justifyContent: 'space-between',
              alignSelf: 'center',
              flexDirection: 'row',
              width: dimensions.width * 0.93,
            }}>
              <TouchableOpacity onPress={() => setWeekStart(new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000))}>
                <ChevronLeftIcon size={dimensions.height * 0.028} color='white' />
              </TouchableOpacity>

              <Text style={{
                alignItems: 'center',
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: 600,
                fontFamily: fontSfProTextRegular,
                fontSize: dimensions.width * 0.037,
                color: 'white',
              }}>
                {headerText}
              </Text>

              <TouchableOpacity onPress={() => setWeekStart(new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}>
                <ChevronRightIcon size={dimensions.height * 0.028} color='white' />
              </TouchableOpacity>
            </View>

            <View style={{
              height: dimensions.height * 0.14,
            }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  width: dimensions.width,
                  alignSelf: 'center',
                  paddingLeft: dimensions.width * 0.05,
                }}
                contentContainerStyle={{
                  paddingRight: dimensions.width * 0.1,
                }}
              >
                <View style={{
                  marginRight: dimensions.width * 0.25,
                  justifyContent: 'space-between',
                  width: dimensions.width * 0.9,
                  alignItems: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                  {weekDates.map((dateObj, index) => {
                    const isSelected = dateObj.date.toDateString() === selectedRainbowCalendarDay.toDateString();
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedRainbowCalendarDay(dateObj.date)}
                        style={{
                          marginRight: dimensions.width * 0.016,
                          borderRadius: dimensions.width * 0.1,
                          alignItems: 'center',
                          width: dimensions.width * 0.16,
                          height: dimensions.height * 0.1,
                          justifyContent: 'center',
                          backgroundColor: isSelected ? '#FDB938' : 'rgba(253, 184, 56, 0.5)',
                        }}
                      >
                        <Text
                          style={{
                            opacity: 0.55,
                            textAlign: 'center',
                            fontSize: dimensions.width * 0.037,
                            color: isSelected ? '#393E42' : 'white',
                            fontWeight: 700,
                            fontFamily: fontSfProTextRegular,
                          }}
                        >
                          {dateObj.dayOfWeek}
                        </Text>
                        <Text
                          style={{
                            fontWeight: 700,
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.043,
                            textAlign: 'center',
                            color: isSelected ? '#393E42' : 'white',
                            marginTop: dimensions.height * 0.004,
                          }}
                        >
                          {dateObj.day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                marginBottom: dimensions.height * 0.01,
              }}
            >
            </View>

            <View style={{ marginBottom: dimensions.height * 0.03, marginTop: dimensions.height * 0.005 }}>
              <Calendar
                onDayPress={handleRainbowDayPress}
                markedDates={markedRainbowDates}
                theme={{
                  calendarBackground: 'transparent',
                  textSectionTitleColor: 'white',
                  todayTextColor: '#F9CF22',
                  selectedDayTextColor: '#1AAC4B',
                  backgroundColor: 'transparent',
                  monthTextColor: 'white',
                  textDisabledColor: 'rgba(255, 255, 255, 0.5)',
                  dotColor: '#F9CF22',
                  selectedDotColor: '#005B41',
                  textDayFontSize: dimensions.width * 0.043,
                  arrowColor: '#005B41',
                  selectedDayBackgroundColor: '#005B41',
                  indicatorColor: '#005B41',
                  dayTextColor: 'white',
                  textMonthFontFamily: fontSfProTextRegular,
                  textDayHeaderFontFamily: fontSfProTextRegular,
                  textDayFontFamily: fontSfProTextRegular,
                  textDayStyle: {
                    fontFamily: fontSfProTextRegular,
                    fontWeight: 500
                  },
                  textMonthStyle: {
                    fontWeight: 500,
                    fontFamily: fontSfProTextRegular,
                  },
                  textDayHeaderFontSize: dimensions.width * 0.037,
                  textMonthFontSize: dimensions.width * 0.043,
                }}
                renderHeader={(date) => {
                  return (
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Text
                        style={{
                          fontFamily: fontSfProTextRegular,
                          fontSize: dimensions.width * 0.046,
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >{formatRainbowHeaderDate(date)}</Text>
                    </View>
                  );
                }}
                style={{
                  marginHorizontal: -dimensions.width * 0.04,
                  paddingBottom: dimensions.height * 0.019,
                  alignSelf: 'center',
                  borderRadius: dimensions.width * 0.043,
                  paddingTop: dimensions.width * 0.01,
                  backgroundColor: 'rgba(253, 185, 56, 0.7)',
                  width: dimensions.width * 0.91,
                  borderWidth: 0,
                }}
              />
            </View>
          </>
        )}
        <View style={{
          marginVertical: dimensions.height * 0.01,
          width: dimensions.width * 0.93,
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text
            style={{
              fontFamily: fontSfProTextRegular,
              textAlign: 'center',
              fontSize: dimensions.width * 0.04,
              fontWeight: 700,
              color: 'white',
            }}
          >
            Rainbow Series
          </Text>

          <Text
            style={{
              fontWeight: 700,
              textAlign: 'center',
              fontSize: dimensions.width * 0.04,
              color: 'white',
              fontFamily: fontSfProTextRegular,
            }}
          >
            X{rainbowSeries}
          </Text>
        </View>
        <View style={{
          height: dimensions.height * 0.032,
          alignSelf: 'center',
          marginTop: dimensions.height * 0.01,
          position: 'relative',
          width: dimensions.width * 0.93,
          backgroundColor: rainbowSeries === 0 ? 'white' : 'transparent',
          borderRadius: dimensions.width * 0.5,
        }}>
          {Array.from({ length: rainbowSeries }).map((_, index) => {
            const containerWidth = dimensions.width * 0.93;
            const overlapOffset = dimensions.width * 0.07;

            const elementWidth = (containerWidth + (rainbowSeries - 1) * overlapOffset) / rainbowSeries;

            const color = rainbowColors[index % rainbowColors.length].color;
            return (
              <View key={index} style={{
                width: elementWidth,
                height: dimensions.height * 0.032,
                backgroundColor: color,
                borderRadius: dimensions.width * 0.5,
                position: 'absolute',
                left: index * (elementWidth - overlapOffset),
                zIndex: index,
              }} />
            );
          })}
        </View>

        <View style={{
          width: dimensions.width * 0.93,
          alignSelf: 'center',
          marginTop: dimensions.height * 0.03,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <View style={{
            width: dimensions.width * 0.44,
            alignSelf: 'flex-start',
            justifyContent: 'space-between',
          }}>
            <Text
              style={{
                fontWeight: 700,
                textAlign: 'left',
                fontSize: dimensions.width * 0.05,
                color: 'white',
                fontFamily: fontSfProTextRegular,
              }}
            >
              {selectedRainbowCalendarDay.toLocaleDateString('default', { month: 'long', day: 'numeric' })}
            </Text>

            <Image
              source={require('../assets/images/persCalendarImage.png')}
              style={{
                height: dimensions.height * 0.31,
                width: dimensions.width * 0.3,
                marginTop: dimensions.height * 0.034,
              }}
              resizeMode='contain'
            />
          </View>

          <View style={{ marginTop: dimensions.height * 0.03, width: dimensions.width * 0.4, alignSelf: 'flex-start', left: -dimensions.width * 0.25 }}>
            <View style={{ position: 'relative', height: dimensions.height * 0.3 }}>
              <View style={{
                borderColor: 'white',
                position: 'absolute',
                borderWidth: dimensions.width * 0.005,
                top: 0,
                bottom: 0,
                width: dimensions.width * 0.0001,
                borderStyle: 'dashed',
                left: dimensions.width * 0.1,
              }} />
              {habitsForSelectedDay.length > 0 ? (
                habitsForSelectedDay.map((habit, idx, arr) => {
                  const dotSize = dimensions.width * 0.05;
                  const containerHeight = dimensions.height * 0.3;
                  let dotTop = arr.length === 1
                    ? containerHeight / 2 - dotSize / 2
                    : (idx / (arr.length - 1)) * (containerHeight - dotSize);
                  return (
                    <View key={idx} style={{
                      position: 'absolute',
                      left: dimensions.width * 0.106 - dotSize / 2,
                      top: dotTop,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <View style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: 'white',
                      }} />
                      <Text style={{
                        color: 'white',
                        fontFamily: fontSfProTextRegular,
                        fontSize: dimensions.width * 0.035,
                        marginLeft: 8,
                        maxWidth: dimensions.width * 0.4,
                      }}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                      >
                        {habit.title || 'Habit'}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <View style={{
                  marginLeft: dimensions.width * 0.16,
                  marginTop: dimensions.height * 0.12,
                  width: dimensions.width * 0.4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: 'white',
                    fontFamily: fontSfProTextRegular,
                    fontSize: dimensions.width * 0.04,
                    textAlign: 'center',
                    fontWeight: 700,
                  }}>
                    Add habits to see them here
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RainbowCalendarScreen;