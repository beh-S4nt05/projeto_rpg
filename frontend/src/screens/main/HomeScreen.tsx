import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserStart, fetchUserSuccess, fetchUserFailure } from '../../store/slices/user.slice';
import { userService } from '../../services/user.service';
import { colors } from '../../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/domain';
import { useTailwind } from 'tailwind-rn';
import Icon from '@expo/vector-icons/FontAwesome5';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const { user, avatar, atributos, isLoading, error } = useAppSelector((state) => state.user);
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    dispatch(fetchUserStart());
    try {
      const userData = await userService.getProfile();
      dispatch(fetchUserSuccess(userData));
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
      <View style={tailwind('mb-8')}>
        <Text style={tailwind('text-2xl font-bold text-text-light mb-2')}>
          Bem-vindo, {displayUser?.username || 'Aventurero'}!
        </Text>
        <Text style={tailwind('text-lg text-text-gray')}>
          Nível {avatar?.level || 1}
        </Text>
      </View>

      <View style={tailwind('bg-background-secondary rounded-lg p-4 mb-8')}>
        <Text style={tailwind('text-sm text-text-gray mb-4')}>Status</Text>
        <View style={tailwind('flex-row justify-around')}>
          <View style={tailwind('items-center')}>
            <Icon name="fire" size={20} color={colors.primary.DEFAULT} />
            <Text style={tailwind('text-text-light ml-2')}>
              {atributos?.experience || 0} XP
            </Text>
          </View>
          <View style={tailwind('items-center')}>
            <Icon name="coins" size={20} color={colors.status.gold} />
            <Text style={tailwind('text-text-light ml-2')}>100 Moedas</Text>
          </View>
          <View style={tailwind('items-center')}>
            <Icon name="heart" size={20} color={colors.status.danger} />
            <Text style={tailwind('text-text-light ml-2')}>
              {atributos?.maxHealth || 100} HP
            </Text>
          </View>
        </View>
      </View>

      <View style={tailwind('mb-8')}>
        <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>
          Menu Rápido
        </Text>

        <View style={tailwind('grid grid-cols-2 gap-4')}>
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

          <TouchableOpacity
            style={tailwind('bg-background-secondary rounded-lg p-4 items-center')}
            onPress={() => Alert.alert('Em breve', 'Função de missões será implementada')}
          >
            <Icon name="map-marker-alt" size={24} color={colors.primary.DEFAULT} />
            <Text style={tailwind('text-text-light mt-2')}>Missões</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={tailwind('bg-status-danger bg-opacity-20 rounded-lg p-4 border border-status-danger')}>
          <Text style={tailwind('text-status-danger text-center')}>Erro: {error}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
