import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { characterService } from '../services/character.service';
import { useTailwind } from 'tailwind-rn';
import Icon from '@expo/vector-icons/FontAwesome5';
import { colors } from '../styles/theme';
import { Attributes } from '../types';

export const AttributesScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { user } = useAppSelector((state) => state.user);
  const { avatar, attributes: storeAttributes } = useAppSelector((state) => state.user);
  const [attributes, setAttributes] = useState<Attributes | null>(storeAttributes);
  const [pointsAvailable, setPointsAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (avatar?.id) {
        try {
          const data = await characterService.getMyAvatar();
          setAttributes(data.attributes);
          setPointsAvailable(data.attributes.attributePoints);
        } catch (error: any) {
          Alert.alert('Erro', error.message);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [avatar?.id]);

  useEffect(() => {
    if (storeAttributes) {
      setAttributes(storeAttributes);
      setPointsAvailable(storeAttributes.attributePoints);
    }
  }, [storeAttributes]);

  const handleIncrease = (attribute: keyof Attributes) => {
    if (pointsAvailable <= 0) {
      Alert.alert('Sem pontos', 'Você não tem pontos de atributo disponíveis');
      return;
    }

    setAttributes((prev) => {
      if (!prev) return null;
      const newValue = (prev[attribute] as number) + 1;
      return {
        ...prev,
        [attribute]: newValue,
      };
    });

    setPointsAvailable((prev) => prev - 1);
  };

  const handleDecrease = (attribute: keyof Attributes) => {
    setAttributes((prev) => {
      if (!prev) return null;
      const currentValue = prev[attribute] as number;
      if (currentValue <= 0) return prev;

      const newValue = currentValue - 1;
      return {
        ...prev,
        [attribute]: newValue,
      };
    });

    setPointsAvailable((prev) => prev + 1);
  };

  const handleSave = async () => {
    if (!attributes || !avatar?.id) return;

    try {
      await characterService.updateAttributes(avatar.id, {
        ...attributes,
        attributePoints: pointsAvailable,
      });
      Alert.alert('Sucesso', 'Atributos salvos com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={tailwind('flex-1 justify-center items-center bg-background-primary')}>{
        <Text style={tailwind('text-text-light text-lg')}>Carregando...</Text>
      }</View>
    );
  }

  if (!attributes) {
    return (
      <View style={tailwind('flex-1 justify-center items-center bg-background-primary')}>{
        <Text style={tailwind('text-status-danger text-lg')}>Não foi possível carregar os atributos</Text>
      }</View>
    );
  }

  const attributeConfig = [
    { key: 'strength', name: 'Força', icon: 'fist-raised' },
    { key: 'agility', name: 'Agilidade', icon: 'running' },
    { key: 'defence', name: 'Defesa', icon: 'shield-alt' },
    { key: 'resistance', name: 'Resistência', icon: 'heart' },
    { key: 'intelligence', name: 'Inteligência', icon: 'brain' },
    { key: 'vitality', name: 'Vitalidade', icon: 'heartbeat' },
  ];

  return (
    <ScrollView contentContainerStyle={tailwind('flex-grow p-6 bg-background-primary')}>{
      <View style={tailwind('mb-8')}>{
        <Text style={tailwind('text-2xl font-bold text-text-light mb-2')}>Atributos</Text>
        <Text style={tailwind('text-lg text-text-gray')}>
          Pontos disponíveis: <Text style={tailwind('text-primary-DEFAULT font-bold')}>{pointsAvailable}</Text>
        </Text>
      }</View>

      <View style={tailwind('space-y-4 mb-8')}>{
        {attributeConfig.map((config) => (
          <View
            key={config.key}
            style={tailwind('bg-background-secondary rounded-lg p-4')}
          >{
            <View style={tailwind('flex-row items-center justify-between mb-4')}>{
              <View style={tailwind('flex-row items-center')}>{
                <Icon name={config.icon} size={18} color={colors.primary.DEFAULT} />
                <Text style={tailwind('text-text-light ml-3 font-medium')}>{config.name}</Text>
              }</View>
              <Text style={tailwind('text-primary-DEFAULT font-bold text-xl')}>{attributes[config.key as keyof Attributes]}</Text>
            }</View>

            <View style={tailwind('flex-row justify-end space-x-2')}>{
              <TouchableOpacity
                style={tailwind(`bg-background-tertiary rounded-lg p-2 w-10 items-center justify-center ${pointsAvailable <= 0 ? 'opacity-50' : ''}`)}
                onPress={() => handleIncrease(config.key as keyof Attributes)}
                disabled={pointsAvailable <= 0}
              >{
                <Icon name="plus" size={16} color={colors.text.light} />
              }</TouchableOpacity>
              <TouchableOpacity
                style={tailwind('bg-background-tertiary rounded-lg p-2 w-10 items-center justify-center')}
                onPress={() => handleDecrease(config.key as keyof Attributes)}
              >{
                <Icon name="minus" size={16} color={colors.text.light} />
              }</TouchableOpacity>
            }</View>
          }</View>
        ))}
      </View>

      <TouchableOpacity
        style={tailwind(`bg-primary-DEFAULT rounded-lg p-4 ${pointsAvailable === (attributes?.attributePoints || 5) ? 'opacity-50' : ''}`)}
        onPress={handleSave}
        disabled={pointsAvailable === (attributes?.attributePoints || 5)}
      >{
        <Text style={tailwind('text-center text-text-dark font-bold text-lg')}>Salvar Atributos</Text>
      }</TouchableOpacity>
    }</ScrollView>
  );
};

export default AttributesScreen;
