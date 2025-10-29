// Test setup file
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret'
process.env.DB_NAME = 'tasktracker_test'
process.env.DB_HOST = process.env.DB_HOST || 'localhost'
process.env.DB_USER = 'postgres'
process.env.DB_PASSWORD = 'password'
process.env.DB_PORT = '5432'
