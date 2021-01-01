import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async create({ response, request, auth }: HttpContextContract) {
    const data = request.only(['email', 'password'])
    const params = request.get()

    await auth.provider.setConnection(params.subdomain)
    const token = await auth.use('api').attempt(data.email, data.password)

    return response.status(200).json(token)
  }
}
