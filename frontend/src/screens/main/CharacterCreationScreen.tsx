import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { RaceType } from '../../types/domain';
import { colors } from '../../styles/theme';

export const CharacterCreationScreen: React.FC = () => {
  const tailwind = useTailwind();
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: '',
    race: RaceType.HUMAN,
  });

  const races = [
    RaceType.HUMAN,
    RaceType.DWARF,
    RaceType.ELF,
    RaceType.HALF_ELF,
    RaceType.DWARF_HALF,
    RaceType.HALFLING,
    RaceType.GNOME,
    RaceType.ORC_HALF,
    RaceType.TIEFLING,
  ];

  const handleNext = () => {
    if (step === 1 && !character.name.trim()) {
      Alert.alert('Erro', 'Por favor, digite um nome para o personagem');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreate = () => {
    Alert.alert('Sucesso', 'Personagem criado com sucesso!');
    // TODO: Call API to create character
  };

  const handleRaceSelect = (race: RaceType) => {
    setCharacter({ ...character, race });
  };

  return (
    <ScrollView contentContainerStyle={tailwind('flex-grow p-6 bg-background-primary')}>
      <Text style={tailwind('text-2xl font-bold text-text-light mb-2 text-center')}>
        Criação de Personagem
      </Text>
      <Text style={tailwind('text-text-gray text-center mb-8')}>
        Passo {step} de 2
      </Text>

      {step === 1 && (
        <View>
          <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>
            Nome do Personagem
          </Text>
          <View style={tailwind('bg-background-secondary rounded-lg p-4 mb-8')}>
            <Text style={tailwind('text-text-gray text-sm mb-2')}>
              Escolha um nome para o seu personagem
            </Text>
            <View style={tailwind('border border-border rounded-lg p-3')}>
              <Text style={tailwind('text-text-light')}>{character.name || 'Digite o nome...'}</Text>
            </View>
            {/* TODO: Add TextInput for character name */}
          </View>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>
            Raça
          </Text>
          <Text style={tailwind('text-text-gray text-sm mb-4')}>
            Escolha a raça do seu personagem
          </Text>
          <View style={tailwind('grid grid-cols-2 gap-4 mb-8')}>
            {races.map((race) => (
              <TouchableOpacity
                key={race}
                style={tailwind(`
                  bg-background-secondary rounded-lg p-4 items-center
                  ${character.race === race ? 'border-2 border-primary-DEFAULT' : 'border border-border'}
                `)}
                onPress={() => handleRaceSelect(race)}
              >
                <Text style={tailwind('text-text-light font-medium')}>{race}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={tailwind('flex-row justify-between mt-8')}>
        {step > 1 && (
          <TouchableOpacity
            style={tailwind('bg-background-secondary rounded-lg p-4 px-8')}
            onPress={handleBack}
          >
            <Text style={tailwind('text-text-light font-medium')}>Voltar</Text>
          </TouchableOpacity>
        )}
        {step < 2 ? (
          <TouchableOpacity
            style={tailwind('bg-primary-DEFAULT rounded-lg p-4 px-8')}
            onPress={handleNext}
          >
            <Text style={tailwind('text-text-dark font-bold')}>Próximo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={tailwind('bg-primary-DEFAULT rounded-lg p-4 px-8')}
            onPress={handleCreate}
          >
            <Text style={tailwind('text-text-dark font-bold')}>Criar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default CharacterCreationScreen;
