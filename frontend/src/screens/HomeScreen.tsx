import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserStart, fetchUserSuccess, fetchUserFailure } from '../store/slices/user.slice';
import { userService } from '../services/user.service';
import { characterService } from '../services/character.service';
import { useTailwind } from 'tailwind-rn';
import Icon from '@expo/vector-icons/FontAwesome5';
import { colors } from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const { user, avatar, attributes } = useAppSelector((state) => state.user);
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    dispatch(fetchUserStart());
    try {
      const [userData, avatarData] = await Promise.all([
        userService.getProfile(),
        characterService.getMyAvatar(),
      ]);
      dispatch(fetchUserSuccess({
        user: userData.user,
        avatar: avatarData.avatar,
        attributes: avatarData.attributes,
        inventory: avatarData.inventory,
      }));
    } catch (error: any) {
      dispatch(fetchUserFailure(error.message));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleNavigate = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  const displayUser = authUser || user;

  return (
    <ScrollView
      contentContainerStyle={tailwind('flex-grow p-6')}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={tailwind('mb-8')}>{
        <Text style={tailwind('text-2xl font-bold text-text-light mb-2')}>Bem-vindo, {displayUser?.username || 'Aventurero'}!</Text>
        <Text style={tailwind('text-lg text-text-gray')}>Nível {avatar?.level || 1}</Text>
      }</View>

      <View style={tailwind('bg-background-secondary rounded-lg p-4 mb-8')}>{
        <Text style={tailwind('text-sm text-text-gray mb-4')}>Status</Text>
        <View style={tailwind('flex-row justify-around')}>{
          <View style={tailwind('items-center')}>{
            <Icon name="fire" size={20} color={colors.primary.DEFAULT} />
            <Text style={tailwind('text-text-light ml-2')}>{attributes?.experience || 0} XP</Text>
          }</View>
          <View style={tailwind('items-center')}>{
            <Icon name="coins" size={20} color={colors.status.gold} />
            <Text style={tailwind('text-text-light ml-2')}>100 Moedas</Text>
          }</View>
          <View style={tailwind('items-center')}>{
            <Icon name="heart" size={20} color={colors.status.danger} />
            <Text style={tailwind('text-text-light ml-2')}>{(attributes?.vitality || 10) * 10} HP</Text>
          }</View>
        }</View>
      }</View>

      <View style={tailwind('mb-8')}>{
        <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>Menu Rápido</Text>

        <View style={tailwind('grid grid-cols-2 gap-4')}>{
          <TouchableOpacity
            style={tailwind('bg-background-secondary rounded-lg p-4 items-center')}
            onPress={() => handleNavigate('Profile')}
          >
            <Icon name="user" size={24} color={colors.primary.DEFAULT} />
            <Text style={tailwind('text-text-light mt-2')}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tailwind('bg-background-secondary rounded-lg p-4 items-center')}
            onPress={() => handleNavigate('Attributes')}
          >
            <Icon name="chart-bar" size={24} color={colors.primary.DEFAULT} />
            <Text style={tailwind('text-text-light mt-2')}>Atributos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tailwind('bg-background-secondary rounded-lg p-4 items-center')}
            onPress={() => handleNavigate('Inventory')}
          >
            <Icon name="backpack" size={24} color={colors.primary.DEFAULT} />
            <Text style={tailwind('text-text-light mt-2')}>Inventário</Text>
          </TouchableOpacity>
        </View>
      }</View>
    </ScrollView>
  );
};

export default HomeScreen;
