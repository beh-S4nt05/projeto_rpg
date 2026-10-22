import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginSuccess } from '../../store/slices/auth.slice';
import { authService } from '../../services/auth.service';
import { colors } from '../../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/domain';
import { useTailwind } from 'tailwind-rn';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const tailwind = useTailwind();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    co_password: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.co_password) {
      newErrors.co_password = 'As senhas não coincidem';
    }

    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve ter 10 ou 11 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await authService.register(formData);

      dispatch(
        loginSuccess({
          user: response.data,
          token: response.data?.access_token || 'dummy-token',
        }),
      );

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Cadastro falhou';
      Alert.alert('Erro', message);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView
      contentContainerStyle={tailwind('flex-grow justify-center p-6')}
      keyboardShouldPersistTaps="handled"
    >
      <View style={tailwind('w-full max-w-sm mx-auto')}>
        <Text style={tailwind('text-3xl font-bold text-text-light mb-2 text-center')}>
          Crie sua conta
        </Text>
        <Text style={tailwind('text-base text-text-gray mb-8 text-center')}>
          Junte-se ao RPG
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
            value={formData.username}
            onChangeText={(value) => handleChange('username', value)}
            autoCapitalize="none"
          />
          {errors.username && (
            <Text style={tailwind('text-status-danger text-xs mt-1')}>{errors.username}</Text>
          )}
        </View>

        <View style={tailwind('mb-4')}>
          <Text style={tailwind('text-sm text-text-light mb-2')}>Nome Completo</Text>
          <TextInput
            style={tailwind(`
              bg-background-secondary border border-border rounded-lg p-3 
              text-text-light placeholder:text-text-gray
              ${errors.name ? 'border-status-danger' : ''}
            `)}
            placeholder="Digite seu nome"
            placeholderTextColor={colors.text.gray}
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
          />
          {errors.name && (
            <Text style={tailwind('text-status-danger text-xs mt-1')}>{errors.name}</Text>
          )}
        </View>

        <View style={tailwind('mb-4')}>
          <Text style={tailwind('text-sm text-text-light mb-2')}>Email</Text>
          <TextInput
            style={tailwind(`
              bg-background-secondary border border-border rounded-lg p-3 
              text-text-light placeholder:text-text-gray
              ${errors.email ? 'border-status-danger' : ''}
            `)}
            placeholder="Digite seu email"
            placeholderTextColor={colors.text.gray}
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text style={tailwind('text-status-danger text-xs mt-1')}>{errors.email}</Text>
          )}
        </View>

        <View style={tailwind('mb-4')}>
          <Text style={tailwind('text-sm text-text-light mb-2')}>Senha</Text>
          <TextInput
            style={tailwind(`
              bg-background-secondary border border-border rounded-lg p-3 
              text-text-light placeholder:text-text-gray
              ${errors.password ? 'border-status-danger' : ''}
            `)}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.text.gray}
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
          />
          {errors.password && (
            <Text style={tailwind('text-status-danger text-xs mt-1')}>{errors.password}</Text>
          )}
        </View>

        <View style={tailwind('mb-4')}>
          <Text style={tailwind('text-sm text-text-light mb-2')}>Confirmar Senha</Text>
          <TextInput
            style={tailwind(`
              bg-background-secondary border border-border rounded-lg p-3 
              text-text-light placeholder:text-text-gray
              ${errors.co_password ? 'border-status-danger' : ''}
            `)}
            placeholder="Confirme sua senha"
            placeholderTextColor={colors.text.gray}
            value={formData.co_password}
            onChangeText={(value) => handleChange('co_password', value)}
            secureTextEntry
          />
          {errors.co_password && (
            <Text style={tailwind('text-status-danger text-xs mt-1')}>{errors.co_password}</Text>
          )}
        </View>

        <View style={tailwind('mb-6')}>
          <Text style={tailwind('text-sm text-text-light mb-2')}>Telefone (opcional)</Text>
          <TextInput
            style={tailwind(`
              bg-background-secondary border border-border rounded-lg p-3 
              text-text-light placeholder:text-text-gray
              ${errors.phone ? 'border-status-danger' : ''}
            `)}
            placeholder="Digite seu telefone"
            placeholderTextColor={colors.text.gray}
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            keyboardType="phone-pad"
          />
          {errors.phone && (
            <Text style={tailwind('text-status-danger text-xs mt-1')}>{errors.phone}</Text>
          )}
        </View>

        <TouchableOpacity
          style={tailwind(`
            bg-primary-DEFAULT rounded-lg p-4 mb-6
            ${isLoading ? 'opacity-50' : ''}
          `)}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.dark} />
          ) : (
            <Text style={tailwind('text-center text-text-dark font-bold text-lg')}>
              Cadastrar
            </Text>
          )}
        </TouchableOpacity>

        <View style={tailwind('flex-row justify-center')}>
          <Text style={tailwind('text-text-gray text-sm')}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={handleNavigateToLogin}>
            <Text style={tailwind('text-primary-DEFAULT text-sm font-bold underline')}>
              Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
