import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import Icon from '@expo/vector-icons/FontAwesome5';
import { colors } from '../styles/theme';

export const InventoryScreen: React.FC = () => {
  const tailwind = useTailwind();

  // Mock data for demonstration
  const inventoryItems = [
    { id: '1', name: 'Espada de Aço', type: 'arma', quantity: 1, weight: 5, rarity: 'comum' },
    { id: '2', name: 'Escudo de Madeira', type: 'armadura', quantity: 1, weight: 8, rarity: 'comum' },
    { id: '3', name: 'Poção de Vida', type: 'pocao', quantity: 3, weight: 1, rarity: 'raro' },
    { id: '4', name: 'Anel de Força', type: 'material', quantity: 1, weight: 1, rarity: 'epico' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'comum':
        return colors.text.gray;
      case 'raro':
        return colors.primary.DEFAULT;
      case 'epico':
        return colors.secondary.DEFAULT;
      case 'lendario':
        return colors.status.gold;
      default:
        return colors.text.light;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'arma':
        return 'sword';
      case 'armadura':
        return 'shield-alt';
      case 'pocao':
        return 'potion';
      case 'material':
        return 'gem';
      default:
        return 'question';
    }
  };

  return (
    <ScrollView contentContainerStyle={tailwind('flex-grow p-6 bg-background-primary')}>{
      <View style={tailwind('mb-8')}>{
        <Text style={tailwind('text-2xl font-bold text-text-light mb-2')}>Inventário</Text>
        <Text style={tailwind('text-lg text-text-gray')}>Peso: 15/100</Text>
      }</View>

      <View style={tailwind('bg-background-secondary rounded-lg p-4 mb-8')}>{
        <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>Itens</Text>

        <View style={tailwind('space-y-3')}>{
          {inventoryItems.map((item) => (
            <View
              key={item.id}
              style={tailwind('bg-background-tertiary rounded-lg p-3 flex-row items-center')}
            >{
              <Icon name={getTypeIcon(item.type)} size={24} color={getRarityColor(item.rarity)} />
              <View style={tailwind('flex-1 ml-3')}>{
                <Text style={tailwind('text-text-light font-medium')}>{item.name}</Text>
                <Text style={tailwind('text-text-gray text-xs')}>{item.type} • {item.rarity} • Peso: {item.weight}</Text>
              }</View>
              <Text style={tailwind('text-text-light')}>x{item.quantity}</Text>
            }</View>
          ))}
        </View>
      }</View>

      <View style={tailwind('grid grid-cols-2 gap-4')}>{
        <TouchableOpacity
          style={tailwind('bg-background-secondary rounded-lg p-4 items-center')}
          onPress={() => alert('Função de usar item será implementada')}
        >{
          <Icon name="plus" size={24} color={colors.primary.DEFAULT} />
          <Text style={tailwind('text-text-light mt-2')}>Usar Item</Text>
        }</TouchableOpacity>

        <TouchableOpacity
          style={tailwind('bg-background-secondary rounded-lg p-4 items-center')}
          onPress={() => alert('Função de organizar será implementada')}
        >{
          <Icon name="sort" size={24} color={colors.primary.DEFAULT} />
          <Text style={tailwind('text-text-light mt-2')}>Organizar</Text>
        }</TouchableOpacity>

        <TouchableOpacity
          style={tailwind('bg-background-secondary rounded-lg p-4 items-center')}
          onPress={() => alert('Função de vender será implementada')}
        >{
          <Icon name="coins" size={24} color={colors.status.gold} />
          <Text style={tailwind('text-text-light mt-2')}>Vender</Text>
        }</TouchableOpacity>

        <TouchableOpacity
          style={tailwind('bg-background-secondary rounded-lg p-4 items-center')}
          onPress={() => alert('Função de descartar será implementada')}
        >{
          <Icon name="trash" size={24} color={colors.status.danger} />
          <Text style={tailwind('text-text-light mt-2')}>Descartar</Text>
        }</TouchableOpacity>
      }</View>
    }</ScrollView>
  );
};

export default InventoryScreen;
