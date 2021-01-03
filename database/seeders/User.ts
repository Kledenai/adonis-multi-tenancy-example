import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name: 'rebeca',
        email: 'rebeca@cmc.com',
        password: 'secret',
      },
      {
        name: 'alise',
        email: 'alise@cmc.com',
        password: 'supersecret',
      },
    ])
  }
}
