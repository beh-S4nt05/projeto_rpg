import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

class PostgresDatabaseConnection {
  constructor() {
    this.prisma = prisma
    this.bcrypt = bcrypt
    this.newId = () => uuidv4()
  }

  password = () => ({
    Match: async (user, password) => {
      return this.bcrypt.compare(password, user.password)
    },
  })

  create = () => ({
    User: async (data) => {
      const hashedPassword = await this.bcrypt.hash(data.password, 10)
      return this.prisma.user.create({
        data: {
          id: this.newId(),
          username: data.username,
          name: data.name,
          password: hashedPassword,
          email: data.email,
          phone: data.phone,
        },
      })
    },
    Avatar: async (user) => {
      return this.prisma.avatar.create({
        data: {
          id: this.newId(),
          avatarId: user.id,

        },
      })
    },
    Atributos: async (user) => {
      return this.prisma.atributos.create({
        data: {
          id: this.newId(),
          avatarId: user.id,
          strength: 0,
          agility: 0,
          defence: 0,
          resistance: 0,
          intelligence: 0,
          vitality: 0,
          energy_points: 0,
          attribute_points: 0,
          skill_points: 0,
        },
      })
    },
    Inventory: async (user) => {
      return this.prisma.inventory.create({
        data: {
          id: this.newId(),
          slot: 0,
          pesoMax: 100,
          peso: 0,
          quantitySlot: 12,
          avatarId: user.id,
        },
      })
    },
    Races: async (user, data) => {
      return this.prisma.races.create({
        data: {
          race: data.name,
          avatarId: user.id,

        },
      })
    }
  })

  find = () => ({
    UserByUsername: async (username) => {
      return this.prisma.user.findUnique({ where: { username } })
    },
    UserById: async (id) => {
      return this.prisma.user.findUnique({ where: { id } })
    },
    AtributosById: async (id) => {
      return this.prisma.atributos.findUnique({ where: { id } })
    },
  })

  update = () => ({
    User: async (id, data) => {
      return this.prisma.user.update({ where: { id }, data })
    },
    Atributos: async (id, data) => {
      return this.prisma.atributos.update({ where: { id }, data })
    },
    Inventory: async (id, data) => {
      return this.prisma.inventory.update({ where: { id }, data })
    },
  })

  delete = () => ({
    User: async (id) => {
      return this.prisma.user.delete({ where: { id } })
    },
    Atributos: async (id) => {
      return this.prisma.atributos.delete({ where: { id } })
    },
    Inventory: async (id) => {
      return this.prisma.inventory.delete({ where: { id } })
    },
  })
}

export default PostgresDatabaseConnection
