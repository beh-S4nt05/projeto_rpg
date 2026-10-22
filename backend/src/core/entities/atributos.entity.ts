export class Atributos {
  constructor(
    public readonly id: string,
    public strength: number = 10,
    public agility: number = 10,
    public defence: number = 10,
    public resistance: number = 10,
    public intelligence: number = 10,
    public vitality: number = 10,
    public energyPoints: number = 100,
    public attributePoints: number = 5,
    public skillPoints: number = 5,
    public readonly avatarId: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  addAttributePoints(points: number): void {
    if (points <= 0) return;
    this.attributePoints += points;
    this.updatedAt = new Date();
  }

  spendAttributePoints(cost: number): void {
    if (this.attributePoints < cost) {
      throw new Error('Not enough attribute points');
    }
    this.attributePoints -= cost;
    this.updatedAt = new Date();
  }

  increaseStrength(amount: number = 1): void {
    this.spendAttributePoints(amount);
    this.strength += amount;
    this.updatedAt = new Date();
  }

  increaseAgility(amount: number = 1): void {
    this.spendAttributePoints(amount);
    this.agility += amount;
    this.updatedAt = new Date();
  }

  increaseDefence(amount: number = 1): void {
    this.spendAttributePoints(amount);
    this.defence += amount;
    this.updatedAt = new Date();
  }

  increaseResistance(amount: number = 1): void {
    this.spendAttributePoints(amount);
    this.resistance += amount;
    this.updatedAt = new Date();
  }

  increaseIntelligence(amount: number = 1): void {
    this.spendAttributePoints(amount);
    this.intelligence += amount;
    this.updatedAt = new Date();
  }

  increaseVitality(amount: number = 1): void {
    this.spendAttributePoints(amount);
    this.vitality += amount;
    this.updatedAt = new Date();
  }

  // Calculate derived attributes
  get maxHealth(): number {
    return this.vitality * 10 + this.level * 5;
  }

  get maxEnergy(): number {
    return this.energyPoints + this.level * 2;
  }

  get attackPower(): number {
    return this.strength * 2 + this.agility;
  }

  get defensePower(): number {
    return this.defence * 2 + this.resistance;
  }

  get magicPower(): number {
    return this.intelligence * 2 + this.resistance;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      strength: this.strength,
      agility: this.agility,
      defence: this.defence,
      resistance: this.resistance,
      intelligence: this.intelligence,
      vitality: this.vitality,
      energyPoints: this.energyPoints,
      attributePoints: this.attributePoints,
      skillPoints: this.skillPoints,
      avatarId: this.avatarId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      maxHealth: this.maxHealth,
      maxEnergy: this.maxEnergy,
      attackPower: this.attackPower,
      defensePower: this.defensePower,
      magicPower: this.magicPower,
    };
  }
}
