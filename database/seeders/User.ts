import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name: 'john',
        email: 'john@vercel.com',
        password: 'secret',
      },
      {
        name: 'marin',
        email: 'marin@vercel.com',
        password: 'supersecret',
      },
    ])
  }
}
