const typeDefs = `
  scalar Date

  type User {
    _id: ID
    username: String
    characters: [Character]
  }

  type Character {
    _id: ID
    alignment: String
    armor: Int
    background: String
    class: String
    deathSaves: DeathSaves
    equipment: [Equipment]
    featureTraits: [FeatureTrait]
    gold: Int
    hp: Hp
    inspriation: Int
    languages: [Language]
    level: Int
    name: String
    proficiencies: [Proficiency]
    race: String
    savingThrows: SavingThrows
    scores: AbilityScores
    skills: Skills
    speed: Int
    spellCastStat: String
    spellSlots: SpellSlotLevel
    spells: SpellLevel
    timeCreated: Date
    treasures: [Treasure]
    weapons: [Weapon]
  }

  type DeathSaves {
    _id: ID
    failures: Int
    successes: Int
  }

  type Equipment {
    _id: ID
    amount: Int
    description: String
    name: String!
  }

  type FeatureTrait {
    _id: ID
    actionType: String
    description: String
    name: String!
    traitType: String
    uses: Int
  }

  type Hp {
    _id: ID
    current: Int!
    dieType: String!
    dieAmountCurrent: Int!
    dieAmountMax: Int!
    max: Int!
    temp: Int
  }

  type Language {
    _id: ID
    name: String!
    proficiency: String!
  }

  type Proficiency {
    _id: ID
    description: String
    name: String!
  }

  type SavingThrows {
    _id: ID
    cha: Boolean
    con: Boolean
    dex: Boolean
    int: Boolean
    str: Boolean
    wis: Boolean
  }

  type AbilityScores {
    _id: ID
    cha: Int
    con: Int
    dex: Int
    int: Int
    str: Int
    wis: Int
  }

  type Skills {
    _id: ID
  }

  type SpellSlotLevel {
    _id: ID
  }

  type SpellSlot {
    _id: ID
  }

  type SpellLevel {
    _id: ID
  }

  type Spell {
    _id: ID
  }

  type Treasure {
    _id: ID
  }

  type Weapon {
    _id: ID
  }

  ######

  type Query {
    getMe: User
    checkUser(username: String!): User
  }

  type Mutation {
    addUser(_id: String!, username: String!): User
  }
`;

export default typeDefs;