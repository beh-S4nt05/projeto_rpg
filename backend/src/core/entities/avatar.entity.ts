export enum RaceType {
  HUMAN = 'Humano',
  DWARF = 'Anão',
  ELF = 'Elfo',
  HALF_ELF = 'Meio-Elfo',
  DWARF_HALF = 'Meio-Anão',
  HALFLING = 'Halfling',
  GNOME = 'Gnomo',
  ORC_HALF = 'Meio-Orc',
  TIEFLING = 'Tiefling',
  USAGI = 'Usagi',
  TORA = 'Tora',
  KARASU = 'Karasu',
  KITSUNE = 'Kitsune',
  INU = 'Inu',
  NEKO = 'Neko',
  HALF_GENIE = 'Meio-Gênio',
  SATYR = 'Sátiro',
  CUSTOM = 'Customizado',
}

export class Avatar {
  constructor(
    public readonly id: string,
    public name: string,
    public race: RaceType,
    public level: number = 1,
    public tier: number = 1,
    public experience: number = 0,
    public readonly userId: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  gainExperience(amount: number): void {
    this.experience += amount;
    this.checkLevelUp();
    this.updatedAt = new Date();
  }

  private checkLevelUp(): void {
    const experienceToNextLevel = this.level * 100;
    while (this.experience >= experienceToNextLevel) {
      this.level++;
      this.experience -= experienceToNextLevel;
    }
  }

  levelUp(): void {
    this.level++;
    this.updatedAt = new Date();
  }

  updateName(newName: string): void {
    this.name = newName;
    this.updatedAt = new Date();
  }

  updateRace(newRace: RaceType): void {
    this.race = newRace;
    this.updatedAt = new Date();
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      race: this.race,
      level: this.level,
      tier: this.tier,
      experience: this.experience,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
