import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/auth.slice';
import { authService } from '../../services/auth.service';
import { colors, typography } from '../../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/domain';
import { useTailwind } from 'tailwind-rn';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const tailwind = useTailwind();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username é obrigatório';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    dispatch(loginStart());

    try {
      const response = await authService.login({
        username,
        password,
      });

      dispatch(
        loginSuccess({
          user: response.user,
          token: response.access_token,
        }),
      );
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login falhou';
      dispatch(loginFailure(message));
      Alert.alert('Erro', message);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={tailwind('flex-1 bg-background-primary p-6 justify-center')}>
      <View style={tailwind('w-full max-w-sm mx-auto')}>
        <Text style={tailwind('text-3xl font-bold text-text-light mb-2 text-center')}>
          Bem-vindo ao RPG
        </Text>
        <Text style={tailwind('text-base text-text-gray mb-8 text-center')}>
          Faça login para continuar
        </Text>

        <View style={tailwind('mb-4')}>
          <Text style={tailwind('text-sm text-text-light mb-2')}>Username</Text>
          <TextInput
            style={tailwind(`
              bg-background-secondary border border-border rounded-lg p-3 
              text-text-light placeholder:text-text-gray
              ${errors.username ? 'border-status-danger' : ''}
            `)}
            placeholder="Digite seu username"
            placeholderTextColor={colors.text.gray}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          {errors.username && (
            <Text style={tailwind('text-status-danger text-xs mt-1')}>{errors.username}</Text>
          )}
        </View>

        <View style={tailwind('mb-6')}>
          <Text style={tailwind('text-sm text-text-light mb-2')}>Senha</Text>
          <TextInput
            style={tailwind(`
              bg-background-secondary border border-border rounded-lg p-3 
              text-text-light placeholder:text-text-gray
              ${errors.password ? 'border-status-danger' : ''}
            `)}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.text.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && (
            <Text style={tailwind('text-status-danger text-xs mt-1')}>{errors.password}</Text>
          )}
        </View>

        <TouchableOpacity
          style={tailwind(`
            bg-primary DEFAULT rounded-lg p-4 mb-6
            ${isLoading ? 'opacity-50' : ''}
          `)}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.dark} />
          ) : (
            <Text style={tailwind('text-center text-text-dark font-bold text-lg')}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <View style={tailwind('flex-row justify-center')}>
          <Text style={tailwind('text-text-gray text-sm')}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={handleNavigateToRegister}>
            <Text style={tailwind('text-primary-DEFAULT text-sm font-bold underline')}>
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
