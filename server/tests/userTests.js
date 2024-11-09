import request from 'supertest';
import app from '../app'; 
import mockingoose from 'mockingoose';
import User from '../models/user';
import { OAuth2Client } from 'google-auth-library';

jest.mock('google-auth-library');

// Mock data
const mockUserData = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
};

describe('User API', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
    mockingoose.reset();
  });

  // Test Register User
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      mockingoose(User).toReturn(null, 'findOne'); // Simulating that user doesn't exist
      
      const response = await request(app)
        .post('/api/users/register')
        .send(mockUserData);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Registered successfully');
    });

    it('should return an error if user already exists', async () => {
      mockingoose(User).toReturn(mockUserData, 'findOne'); // Simulating user exists
      
      const response = await request(app)
        .post('/api/users/register')
        .send(mockUserData);

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('User already exists');
    });

    it('should return an error if data is incomplete', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ email: '', password: '', name: '' });

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('Please fill all the fields');
    });
  });

  // Test Login User
  describe('POST /login', () => {
    it('should login successfully', async () => {
      mockingoose(User).toReturn(mockUserData, 'findOne');
      
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('user login successful');
    });

    it('should return an error for invalid credentials', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Invalid details please try again');
    });

    it('should return an error for mismatched password', async () => {
      mockingoose(User).toReturn({ ...mockUserData, password: 'wrongpassword' }, 'findOne');
      
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Password mismatched');
    });
  });

  // Test Login with Google
  describe('POST /google-login', () => {
    it('should login user via Google', async () => {
      const googleToken = 'valid-google-token';
      const mockPayload = {
        sub: 'google-user-id',
        email: 'google-user@example.com',
      };

      // Mock Google OAuth Client
      const mockTicket = {
        getPayload: jest.fn().mockReturnValue(mockPayload),
      };
      OAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue(mockTicket);

      const response = await request(app)
        .post('/api/users/google-login')
        .send({ token: googleToken });

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Login successful');
      expect(response.body.userId).toBe(mockPayload.sub);
      expect(response.body.email).toBe(mockPayload.email);
    });

    it('should return an error if Google token is invalid', async () => {
      const googleToken = 'invalid-google-token';

      // Mock Google OAuth Client to throw an error
      OAuth2Client.prototype.verifyIdToken = jest.fn().mockRejectedValue(new Error('Invalid token'));

      const response = await request(app)
        .post('/api/users/google-login')
        .send({ token: googleToken });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Invalid Google token');
    });
  });

  // Test Get All Users
  describe('GET /users', () => {
    it('should get all users', async () => {
      const mockUsers = [mockUserData, { ...mockUserData, email: 'another@example.com' }];
      mockingoose(User).toReturn(mockUsers, 'find');

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].email).toBe(mockUserData.email);
    });
  });

  // Test Get User by ID
  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const mockUser = mockUserData;
      mockingoose(User).toReturn(mockUser, 'findById');

      const response = await request(app).get('/api/users/12345');

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(mockUser.email);
    });

    it('should return an error if user is not found', async () => {
      mockingoose(User).toReturn(null, 'findById');
      
      const response = await request(app).get('/api/users/12345');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  // Test Update User
  describe('PUT /users/:id', () => {
    it('should update user data', async () => {
      const updatedUser = { ...mockUserData, name: 'Updated User' };
      mockingoose(User).toReturn(updatedUser, 'findByIdAndUpdate');

      const response = await request(app)
        .put('/api/users/12345')
        .send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated User');
    });
  });

  // Test Delete User
  describe('DELETE /users/:id', () => {
    it('should delete a user successfully', async () => {
      mockingoose(User).toReturn(mockUserData, 'findByIdAndDelete');

      const response = await request(app).delete('/api/users/12345');

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Deleted success');
    });
  });

});
