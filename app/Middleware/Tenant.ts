import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'

export default class Tenant {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const params = ctx.request.get()

    try {
      const database = await this.getCompany(params.subdomain)
      const connection = await this.createConnection(database)

      const connectionName = params.subdomain

      if (!Database.manager.has(connectionName)) {
        Database.manager.add(connectionName, connection)
        Database.manager.connect(connectionName)
      }

      await next()
    } catch (error) {
      return ctx.response.status(400).json(error.message)
    }
  }

  public async createConnection(database) {
    return {
      client: 'mysql' as const,
      connection: {
        host: database.db_hostname,
        port: 3306,
        user: database.db_username,
        password: database.db_password,
        database: database.db_database,
      },
      debug: false,
    }
  }

  public async getCompany(subdomain) {
    const response = await axios.get('http://localhost:3333/connection', {
      params: {
        subdomain: subdomain,
      },
    })

    return response.data
  }
}
