// generate-token.js
import jwt from 'jsonwebtoken';

const payload = {
  email: 'admin@gmail.com',  // ton compte admin ou test
  role: 'admin',
  sub: 'id-de-lutilisateur'
};

const token = jwt.sign(payload, 'super_secret_key_2025_agriconnect', { expiresIn: '1h' });

console.log(token);
