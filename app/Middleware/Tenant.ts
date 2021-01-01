import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'

export default class Tenant {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const params = ctx.request.get()

    try {
      const result = await axios.get('http://localhost:3333/connection', {
        params: {
          subdomain: params.subdomain,
        },
      })

      const connection = {
        client: 'mysql' as const,
        connection: {
          host: result.data.db_hostname,
          port: 3306,
          user: result.data.db_username,
          password: result.data.db_password,
          database: result.data.db_database,
        },
        debug: false,
      }

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
}
