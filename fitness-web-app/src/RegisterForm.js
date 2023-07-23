import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import axios from 'axios';


//10 rounds of hashing, considered a good compromise between speed and security


//use state to handle form setting variables
const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();

    const hashedPassword = bcrypt.hashSync(password, 10);


  try {
    const response = await axios.post('http://localhost:4000/register', {

    email,
    password: hashedPassword,
    username: username,
    firstname,
    lastname,

    });

    console.log('Response:' , response.data);
  } catch (error) {
    console.error('Error:' , error);
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="String"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="firstname">First Name:</label>
        <input
          type="String"
          id="firstname"
          value={firstname}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="lastname">Last Name:</label>
        <input
          type="String"
          id="lastname"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default RegisterForm;