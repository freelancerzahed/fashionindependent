import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import type { User, CreateUserRequest, UpdateUserRequest } from "./types"

// In-memory database for demonstration purposes
// In a real application, this would be a persistent database (e.g., PostgreSQL, MongoDB)

const users: User[] = []
const products: any[] = [] // Placeholder for products
const orders: any[] = [] // Placeholder for orders
const bodyMeasurements: any[] = [] // Placeholder for body measurements
const posts: any[] = [] // Placeholder for posts

// Seed a default user for testing
async function seedUsers() {
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash("password", 10) // Hash a default password
    users.push({
      id: uuidv4(),
      email: "user@example.com",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      password: hashedPassword, // Store hashed password
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    console.log("Seeded default user: user@example.com / password")
  }
}

// Call seed function immediately
seedUsers()

export const userDb = {
  async create(userData: CreateUserRequest): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.push(newUser)
    return newUser
  },

  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const start = (page - 1) * limit
    const end = start + limit
    return {
      users: users.slice(start, end).map(({ password, ...user }) => user), // Exclude password
      total: users.length,
    }
  },

  async findById(id: string): Promise<User | undefined> {
    const user = users.find((u) => u.id === id)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword as User
    }
    return undefined
  },

  async findByEmail(email: string): Promise<User | undefined> {
    return users.find((u) => u.email === email) // Return full user for password validation
  },

  async findByUsername(username: string): Promise<User | undefined> {
    const user = users.find((u) => u.username === username)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword as User
    }
    return undefined
  },

  async update(id: string, updates: UpdateUserRequest): Promise<User | undefined> {
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) {
      return undefined
    }
    const updatedUser = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() }
    users[userIndex] = updatedUser
    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword as User
  },

  async delete(id: string): Promise<boolean> {
    const initialLength = users.length
    users.splice(
      users.findIndex((u) => u.id === id),
      1,
    )
    return users.length < initialLength
  },

  async validatePassword(user: User, passwordAttempt: string): Promise<boolean> {
    return bcrypt.compare(passwordAttempt, user.password)
  },
}

export const productDb = {
  async findAll(page: number, limit: number): Promise<{ products: any[]; total: number }> {
    const start = (page - 1) * limit
    const end = start + limit
    return {
      products: products.slice(start, end),
      total: products.length,
    }
  },
  async findById(id: string): Promise<any | undefined> {
    return products.find((p) => p.id === id)
  },
  async create(productData: any): Promise<any> {
    const newProduct = { id: uuidv4(), ...productData, createdAt: new Date().toISOString() }
    products.push(newProduct)
    return newProduct
  },
  async update(id: string, updates: any): Promise<any | undefined> {
    const productIndex = products.findIndex((p) => p.id === id)
    if (productIndex === -1) return undefined
    const updatedProduct = { ...products[productIndex], ...updates, updatedAt: new Date().toISOString() }
    products[productIndex] = updatedProduct
    return updatedProduct
  },
  async delete(id: string): Promise<boolean> {
    const initialLength = products.length
    products.splice(
      products.findIndex((p) => p.id === id),
      1,
    )
    return products.length < initialLength
  },
}

export const orderDb = {
  async findAll(page: number, limit: number): Promise<{ orders: any[]; total: number }> {
    const start = (page - 1) * limit
    const end = start + limit
    return {
      orders: orders.slice(start, end),
      total: orders.length,
    }
  },
  async findById(id: string): Promise<any | undefined> {
    return orders.find((o) => o.id === id)
  },
  async create(orderData: any): Promise<any> {
    const newOrder = { id: uuidv4(), ...orderData, createdAt: new Date().toISOString() }
    orders.push(newOrder)
    return newOrder
  },
  async update(id: string, updates: any): Promise<any | undefined> {
    const orderIndex = orders.findIndex((o) => o.id === id)
    if (orderIndex === -1) return undefined
    const updatedOrder = { ...orders[orderIndex], ...updates, updatedAt: new Date().toISOString() }
    orders[orderIndex] = updatedOrder
    return updatedOrder
  },
  async delete(id: string): Promise<boolean> {
    const initialLength = orders.length
    orders.splice(
      orders.findIndex((o) => o.id === id),
      1,
    )
    return orders.length < initialLength
  },
}

export const bodyMeasurementDb = {
  async findAll(page: number, limit: number): Promise<{ bodyMeasurements: any[]; total: number }> {
    const start = (page - 1) * limit
    const end = start + limit
    return {
      bodyMeasurements: bodyMeasurements.slice(start, end),
      total: bodyMeasurements.length,
    }
  },
  async findById(id: string): Promise<any | undefined> {
    return bodyMeasurements.find((bm) => bm.id === id)
  },
  async create(data: any): Promise<any> {
    const newMeasurement = { id: uuidv4(), ...data, createdAt: new Date().toISOString() }
    bodyMeasurements.push(newMeasurement)
    return newMeasurement
  },
  async update(id: string, updates: any): Promise<any | undefined> {
    const index = bodyMeasurements.findIndex((bm) => bm.id === id)
    if (index === -1) return undefined
    const updatedMeasurement = { ...bodyMeasurements[index], ...updates, updatedAt: new Date().toISOString() }
    bodyMeasurements[index] = updatedMeasurement
    return updatedMeasurement
  },
  async delete(id: string): Promise<boolean> {
    const initialLength = bodyMeasurements.length
    bodyMeasurements.splice(
      bodyMeasurements.findIndex((bm) => bm.id === id),
      1,
    )
    return bodyMeasurements.length < initialLength
  },
}

export const postDb = {
  async findAll(page: number, limit: number): Promise<{ posts: any[]; total: number }> {
    const start = (page - 1) * limit
    const end = start + limit
    return {
      posts: posts.slice(start, end),
      total: posts.length,
    }
  },
  async findById(id: string): Promise<any | undefined> {
    return posts.find((p) => p.id === id)
  },
  async create(postData: any): Promise<any> {
    const newPost = { id: uuidv4(), ...postData, createdAt: new Date().toISOString() }
    posts.push(newPost)
    return newPost
  },
  async update(id: string, updates: any): Promise<any | undefined> {
    const postIndex = posts.findIndex((p) => p.id === id)
    if (postIndex === -1) return undefined
    const updatedPost = { ...posts[postIndex], ...updates, updatedAt: new Date().toISOString() }
    posts[postIndex] = updatedPost
    return updatedPost
  },
  async delete(id: string): Promise<boolean> {
    const initialLength = posts.length
    posts.splice(
      posts.findIndex((p) => p.id === id),
      1,
    )
    return posts.length < initialLength
  },
}

export const db = {
  users: userDb,
  products: productDb,
  orders: orderDb,
  bodyMeasurements: bodyMeasurementDb,
  posts: postDb,
}

export async function getProductById(id: string): Promise<any | undefined> {
  return productDb.findById(id)
}
