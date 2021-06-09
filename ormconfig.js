module.exports = [
  {
    name: "default",
    type: "postgres",
    host: `${process.env.POSTGRES_HOST}`,
    port: `${process.env.POSTGRES_PORT}`,
    database: `${process.env.POSTGRES_DB}`,
    username: `${process.env.POSTGRES_USERNAME}`,
    password: `${process.env.POSTGRES_PASS}`,
    entities: [
      "src/modules/**/infra/typeorm/entities/*.ts"
    ],
    migrations: [
      "src/shared/infra/typeorm/migrations/*.ts"
    ],
    cli: {
      migrationsDir: "src/shared/infra/typeorm/migrations"
    }
  },
  {
    name: "mongo",
    type: "mongodb",
    host: `${process.env.MONGO_HOST}`,
    port: `${process.env.MONGO_PORT}`,
    database: `${process.env.MONGO_DB}`,
    username: `${process.env.MONGO_USERNAME}`,
    password: `${process.env.MONGO_PASS}`,
    useUnifiedTopology: true,
    entities: [
      "src/modules/**/infra/typeorm/schemas/*.ts"
    ]
  }
]
