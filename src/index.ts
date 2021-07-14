import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { User } from './users/user.entity';

createConnection()
  .then(async (connection) => {
    console.log('Inserting admin user into the database...');
    const user = new User();
    user.username = 'Admin';
    user.password = '1q2w3e4r';
    user.isManager = true;
    await connection.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await connection.manager.find(User);
    console.log('Loaded users: ', users);

    console.log('Here you can setup and run express/koa/any other framework.');
  })
  .catch((error) => console.log(error));
