import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class AuthController {
  public async create({ response, request, auth }: HttpContextContract) {
    const data = request.only(['email', 'password'])
    const params = request.get()

    try {
      const user = await User.query({
        connection: params.subdomain,
      })
        .where('email', '=', data.email)
        .first()

      if (await !user) {
        return response.status(404).json({ message: 'User not found' })
      }

      const password = user?.password

      const isSame = await Hash.verify(password as string, data.password)

      if ((await isSame) === false) {
        return response.status(404).json({ message: 'Unknown password' })
      }

      const token = await auth.use('api').attempt(data.email, data.password)

      return response.status(200).json({ user: user, token: token })
    } catch (error) {
      return response.status(400).json(error.message)
    }
  }
}
