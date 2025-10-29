import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tasktracker',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
)

export async function connectDb () {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')
    await sequelize.sync({ alter: true })
    console.log('Database synchronized')
  } catch (error) {
    console.error('Unable to connect to database:', error)
    throw error
  }
}

export { sequelize }
