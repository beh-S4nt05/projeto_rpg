import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { colors } from '../../styles/theme';
import { userService } from '../../services/user.service';
import { User, Avatar, Atributos } from '../../types/domain';
import { useTailwind } from 'tailwind-rn';
import Icon from '@expo/vector-icons/FontAwesome5';
import { authService } from '../../services/auth.service';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/auth.slice';

export const ProfileScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { user, avatar, atributos } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await userService.getProfile();
      // Data is already in the store via AppNavigator
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar o perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Em breve', 'Função de edição de perfil será implementada');
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          await authService.logout();
          dispatch(logout());
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={tailwind('flex-1 justify-center items-center bg-background-primary')}>
        <Text style={tailwind('text-text-light text-lg')}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!authUser && !user) {
    return (
      <View style={tailwind('flex-1 justify-center items-center bg-background-primary')}>
        <Text style={tailwind('text-status-danger text-lg')}>Usuário não encontrado</Text>
      </View>
    );
  }

  const displayUser = user || authUser;

  return (
    <ScrollView contentContainerStyle={tailwind('flex-grow p-6 bg-background-primary')}>
      <View style={tailwind('items-center mb-8')}>
        <View style={tailwind('w-24 h-24 rounded-full bg-background-secondary items-center justify-center mb-4')}>
          <Icon name="user-circle" size={80} color={colors.primary.DEFAULT} />
        </View>
        <Text style={tailwind('text-2xl font-bold text-text-light mb-2')}>
          {displayUser.username}
        </Text>
        <Text style={tailwind('text-lg text-text-gray')}>{displayUser.name}</Text>
      </View>

      <View style={tailwind('bg-background-secondary rounded-lg p-4 mb-8')}>
        <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>
          Informações Pessoais
        </Text>

        <View style={tailwind('mb-4')}>
          <View style={tailwind('flex-row items-center mb-2')}>
            <Icon name="envelope" size={16} color={colors.text.gray} />
            <Text style={tailwind('text-text-light ml-3')}>{displayUser.email}</Text>
          </View>
        </View>

        {displayUser.phone && (
          <View style={tailwind('mb-4')}>
            <View style={tailwind('flex-row items-center mb-2')}>
              <Icon name="phone" size={16} color={colors.text.gray} />
              <Text style={tailwind('text-text-light ml-3')}>{displayUser.phone}</Text>
            </View>
          </View>
        )}

        <View style={tailwind('mb-4')}>
          <View style={tailwind('flex-row items-center mb-2')}>
            <Icon name="calendar" size={16} color={colors.text.gray} />
            <Text style={tailwind('text-text-light ml-3')}>
              Membro desde: {new Date(displayUser.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </View>

      {avatar && (
        <View style={tailwind('bg-background-secondary rounded-lg p-4 mb-8')}>
          <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>
            Personagem
          </Text>

          <View style={tailwind('mb-4')}>
            <View style={tailwind('flex-row items-center mb-2')}>
              <Icon name="user" size={16} color={colors.text.gray} />
              <Text style={tailwind('text-text-light ml-3')}>{avatar.name}</Text>
            </View>
          </View>

          <View style={tailwind('mb-4')}>
            <View style={tailwind('flex-row items-center mb-2')}>
              <Icon name="flag" size={16} color={colors.text.gray} />
              <Text style={tailwind('text-text-light ml-3')}>{avatar.race}</Text>
            </View>
          </View>

          <View style={tailwind('grid grid-cols-3 gap-4')}>
            <View style={tailwind('items-center')}>
              <Text style={tailwind('text-text-gray text-sm')}>Nível</Text>
              <Text style={tailwind('text-text-light font-bold')}>{avatar.level}</Text>
            </View>
            <View style={tailwind('items-center')}>
              <Text style={tailwind('text-text-gray text-sm')}>Tier</Text>
              <Text style={tailwind('text-text-light font-bold')}>{avatar.tier}</Text>
            </View>
            <View style={tailwind('items-center')}>
              <Text style={tailwind('text-text-gray text-sm')}>XP</Text>
              <Text style={tailwind('text-text-light font-bold')}>{avatar.experience}</Text>
            </View>
          </View>
        </View>
      )}

      {atributos && (
        <View style={tailwind('bg-background-secondary rounded-lg p-4 mb-8')}>
          <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>
            Atributos
          </Text>

          <View style={tailwind('grid grid-cols-2 gap-4')}>
            <View>
              <Text style={tailwind('text-text-gray text-sm')}>Força</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.strength}</Text>
            </View>
            <View>
              <Text style={tailwind('text-text-gray text-sm')}>Agilidade</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.agility}</Text>
            </View>
            <View>
              <Text style={tailwind('text-text-gray text-sm')}>Defesa</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.defence}</Text>
            </View>
            <View>
              <Text style={tailwind('text-text-gray text-sm')}>Resistência</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.resistance}</Text>
            </View>
            <View>
              <Text style={tailwind('text-text-gray text-sm')}>Inteligência</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.intelligence}</Text>
            </View>
            <View>
              <Text style={tailwind('text-text-gray text-sm')}>Vitalidade</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.vitality}</Text>
            </View>
          </View>

          <View style={tailwind('mt-4 pt-4 border-t border-border')}>
            <Text style={tailwind('text-text-gray text-sm mb-2')}>Pontos disponíveis</Text>
            <Text style={tailwind('text-primary-DEFAULT font-bold text-center')}>
              {atributos.attributePoints}
            </Text>
          </View>
        </View>
      )}

      <View style={tailwind('mt-8')}>
        <TouchableOpacity
          style={tailwind('bg-background-secondary rounded-lg p-4 mb-4 items-center')}
          onPress={handleEditProfile}
        >
          <Icon name="edit" size={20} color={colors.primary.DEFAULT} />
          <Text style={tailwind('text-text-light ml-3 font-medium')}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tailwind('bg-status-danger rounded-lg p-4 items-center')}
          onPress={handleLogout}
        >
          <Icon name="sign-out-alt" size={20} color={colors.text.light} />
          <Text style={tailwind('text-text-light ml-3 font-medium')}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
