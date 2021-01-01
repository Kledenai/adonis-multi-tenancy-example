import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response, request }: HttpContextContract) {
    const params = request.get()

    const users = await User.query({
      connection: params.subdomain,
    })

    return response.status(200).json(users)
  }

  public async store({ response, request }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password'])
    const params = request.get()

    await Database.connection(params.subdomain, { mode: 'write' }).transaction(async (trx) => {
      const user = new User()

      user.name = data.name
      user.email = data.email
      user.password = data.password

      user.useTransaction(trx)
      await user.save()
    })

    return response.status(200).json({ message: 'User Created with successful' })
  }
}
