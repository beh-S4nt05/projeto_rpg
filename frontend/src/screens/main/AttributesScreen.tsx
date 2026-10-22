import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { colors } from '../../styles/theme';
import { userService } from '../../services/user.service';
import { Atributos } from '../../types/domain';
import { useTailwind } from 'tailwind-rn';
import Icon from '@expo/vector-icons/FontAwesome5';

export const AttributesScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { user } = useAppSelector((state) => state.user);
  const { avatar, atributos: storeAtributos } = useAppSelector((state) => state.user);
  const [atributos, setAtributos] = useState<Atributos | null>(storeAtributos);
  const [pointsAvailable, setPointsAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAtributos = async () => {
      if (avatar?.id) {
        try {
          const data = await userService.getAtributos(avatar.id);
          setAtributos(data);
          setPointsAvailable(data.attributePoints);
        } catch (error) {
          console.error('Failed to fetch atributos:', error);
        }
      }
      setIsLoading(false);
    };

    fetchAtributos();
  }, [avatar?.id]);

  useEffect(() => {
    if (storeAtributos) {
      setAtributos(storeAtributos);
      setPointsAvailable(storeAtributos.attributePoints);
    }
  }, [storeAtributos]);

  const handleIncrease = (attribute: keyof Atributos) => {
    if (pointsAvailable <= 0) {
      Alert.alert('Sem pontos', 'Você não tem pontos de atributo disponíveis');
      return;
    }

    setAtributos((prev) => {
      if (!prev) return null;
      const newValue = (prev[attribute] as number) + 1;
      return {
        ...prev,
        [attribute]: newValue,
      };
    });

    setPointsAvailable((prev) => prev - 1);
  };

  const handleDecrease = (attribute: keyof Atributos) => {
    setAtributos((prev) => {
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
    if (!atributos || !avatar?.id) return;

    try {
      await userService.updateAtributos(avatar.id, {
        ...atributos,
        attributePoints: pointsAvailable,
      });
      Alert.alert('Sucesso', 'Atributos salvos com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível salvar os atributos');
    }
  };

  if (isLoading) {
    return (
      <View style={tailwind('flex-1 justify-center items-center bg-background-primary')}>
        <Text style={tailwind('text-text-light text-lg')}>Carregando...</Text>
      </View>
    );
  }

  if (!atributos) {
    return (
      <View style={tailwind('flex-1 justify-center items-center bg-background-primary')}>
        <Text style={tailwind('text-status-danger text-lg')}>
          Não foi possível carregar os atributos
        </Text>
      </View>
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
    <ScrollView contentContainerStyle={tailwind('flex-grow p-6 bg-background-primary')}>
      <View style={tailwind('mb-8')}>
        <Text style={tailwind('text-2xl font-bold text-text-light mb-2')}>
          Atributos
        </Text>
        <Text style={tailwind('text-lg text-text-gray')}>
          Pontos disponíveis: <Text style={tailwind('text-primary-DEFAULT font-bold')}>{pointsAvailable}</Text>
        </Text>
      </View>

      <View style={tailwind('space-y-4 mb-8')}>
        {attributeConfig.map((config) => (
          <View
            key={config.key}
            style={tailwind('bg-background-secondary rounded-lg p-4')}
          >
            <View style={tailwind('flex-row items-center justify-between mb-4')}>
              <View style={tailwind('flex-row items-center')}>
                <Icon name={config.icon} size={18} color={colors.primary.DEFAULT} />
                <Text style={tailwind('text-text-light ml-3 font-medium')}>{config.name}</Text>
              </View>
              <Text style={tailwind('text-primary-DEFAULT font-bold text-xl')}>
                {atributos[config.key as keyof Atributos]}
              </Text>
            </View>

            <View style={tailwind('flex-row justify-end space-x-2')}>
              <TouchableOpacity
                style={tailwind(`
                  bg-background-tertiary rounded-lg p-2 w-10 items-center justify-center
                  ${pointsAvailable <= 0 ? 'opacity-50' : ''}
                `)}
                onPress={() => handleIncrease(config.key as keyof Atributos)}
                disabled={pointsAvailable <= 0}
              >
                <Icon name="plus" size={16} color={colors.text.light} />
              </TouchableOpacity>
              <TouchableOpacity
                style={tailwind('bg-background-tertiary rounded-lg p-2 w-10 items-center justify-center')}
                onPress={() => handleDecrease(config.key as keyof Atributos)}
              >
                <Icon name="minus" size={16} color={colors.text.light} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {atributos.maxHealth && (
        <View style={tailwind('bg-background-secondary rounded-lg p-4 mb-8')}>
          <Text style={tailwind('text-lg font-bold text-text-light mb-4')}>
            Atributos Derivados
          </Text>

          <View style={tailwind('grid grid-cols-2 gap-4')}>
            <View style={tailwind('items-center')}>
              <Text style={tailwind('text-text-gray text-sm')}>Vida Máxima</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.maxHealth}</Text>
            </View>
            <View style={tailwind('items-center')}>
              <Text style={tailwind('text-text-gray text-sm')}>Energia Máxima</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.maxEnergy}</Text>
            </View>
            <View style={tailwind('items-center')}>
              <Text style={tailwind('text-text-gray text-sm')}>Poder de Ataque</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.attackPower}</Text>
            </View>
            <View style={tailwind('items-center')}>
              <Text style={tailwind('text-text-gray text-sm')}>Poder de Defesa</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.defensePower}</Text>
            </View>
            <View style={tailwind('items-center col-span-2')}>
              <Text style={tailwind('text-text-gray text-sm')}>Poder Mágico</Text>
              <Text style={tailwind('text-text-light font-bold')}>{atributos.magicPower}</Text>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={tailwind(`
          bg-primary-DEFAULT rounded-lg p-4
          ${pointsAvailable === (atributos.attributePoints || 5) ? 'opacity-50' : ''}
        `)}
        onPress={handleSave}
        disabled={pointsAvailable === (atributos.attributePoints || 5)}
      >
        <Text style={tailwind('text-center text-text-dark font-bold text-lg')}>
          Salvar Atributos
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AttributesScreen;
