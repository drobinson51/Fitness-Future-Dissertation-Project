let mockSendMail = jest.fn();

jest.mock('nodemailer', () => {
  console.log("We've been called");
  return {
    createTransport: jest.fn(() => ({
      sendMail: mockSendMail
    })),
  };
});



const request = require('supertest');


const {app, db, sendWeeklyMail, emailLayoutOptions, getUserEmailsData } = require('./Server'); 



const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');

const queries = require ("./queries.js")

// sets mockmail to nodemailer itself helping overcome issue of code not being called. 
nodemailer.createTransport().sendMail = mockSendMail;


let callCount = 0;

jest.setTimeout(5000);

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();

  callCount = 0;
});






jest.mock('bcryptjs', () => ({
  compare: jest.fn((password, hashedPassword) => {
    return password === 'examplepassword'; // Simulate password comparison
  }),

  hash: jest.fn(() => 'mockedHashedPassword')
}));


describe('Email Utility Functions', () => {
    
  describe('getUserEmailsData', () => {
    it('should correctly transform rows to userEmailsData map', () => {
      const mockRows = [
        {
          user_email: "johndoe@example.com",
          day: "Monday",
          user_first_name: "John",
          workoutname: "Bench Press",
          customliftweight: 60,
          customliftreps: 10
        },
        {
          user_email: "johndoe@example.com",
          day: "Tuesday",
          user_first_name: "John",
          workoutname: "Squats",
          customliftweight: 70,
          customliftreps: 12
        }
      ];
      
      const result = getUserEmailsData(mockRows);
  
     
      expect(result).toBeInstanceOf(Map);
      expect(result.get("johndoe@example.com")).toEqual({
        "userName": "John",
        "Monday": [
          {
            "workoutname": "Bench Press",
            "weight": 60,
            "reps": 10
          }
        ],
        "Tuesday": [
          {
            "workoutname": "Squats",
            "weight": 70,
            "reps": 12
          }
        ]
      });
    });
  });
  

  describe('emailLayoutOptions', () => {
    it('should correctly build email layout options', () => {
        const mockUserData = {
          userName: "John",
          Monday: [
            {
              workoutname: "Bench Press",
              weight: 60,
              reps: 10
            }
          ],
          Tuesday: [
            {
              workoutname: "Squats",
              weight: 70,
              reps: 12
            }
          ]
        };
        const userEmail = "some@example.com";
        const result = emailLayoutOptions(userEmail, mockUserData);
  
        expect(result).toMatchObject({
            from: process.env.EMAILSENDER,
            to: userEmail,
            subject: "Fitness Future: Your Workout Schedule for the Week",
            text: expect.stringContaining("Hello John")
        });
    });
  });
  

  describe('sendWeeklyMail', () => {
    
    // Clear mock state before each test
    beforeEach(() => {
      mockSendMail.mockClear();
    });
  
    it('should send mails correctly', () => {
        const mockRows = [
          {
            user_email: "johndoe@example.com",
            day: "Monday",
            user_first_name: "John",
            workoutname: "Bench Press",
            customliftweight: 60,
            customliftreps: 10
          },
          {
            user_email: "johndoe@example.com",
            day: "Tuesday",
            user_first_name: "John",
            workoutname: "Squats",
            customliftweight: 70,
            customliftreps: 12
          },
          {
            user_email: "janedoe@example.com",
            day: "Monday",
            user_first_name: "Jane",
            workoutname: "Deadlift",
            customliftweight: 80,
            customliftreps: 8
          }
        ];
        
        sendWeeklyMail(null, mockRows);
        
        expect(mockSendMail).toHaveBeenCalled();
    });
        
    it('should throw error if there is one', () => {
        const error = new Error('DB error');
        expect(() => sendWeeklyMail(error)).toThrow('DB error');
    });
});
});


// API tests.

describe('POST /exerciseprogress', () => {
  it('should insert exercise progress into the database', async () => {
    // Mock the request body
    const requestBody = {
      userid: 123,
      userworkoutid: 456,
      totalweightlifted: 100,
      repscompleted: 10,
    };


    let exerciseprogress = queries.EXERCISEPROGRESS;

    // Mock the database query function
    db.query = jest.fn((query, values, callback) => {
      expect(query).toEqual(exerciseprogress);
      expect(values).toEqual([
        requestBody.userid,
        requestBody.userworkoutid,
        requestBody.totalweightlifted,
        requestBody.repscompleted,
        expect.any(String),
      ]);


      // Simulate a successful database insertion
      callback(null, { insertId: 1 });
    });

    // Perform the POST request using supertest
    const response = await request(app)
      .post('/exerciseprogress')
      .send(requestBody);

    // Assertions on the response
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: "success",
      data: { insertId: 1 },  
      successMessage: 'Nice workout you killed it! Keep it up.',
    });
  });
    
  it('should respond with internal server error if db error is present', async () => {
    const requestBody = {
      userid: 123,
      userworkoutid: 456,
      totalweightlifted: 100,
      repscompleted: 10,
    };
  
    
    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });
  
    const response = await request(app)
      .post('/exerciseprogress')
      .send(requestBody);
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should respond with 404, if no data is available to post', async () => {
    // Mock the request body
    const requestBody = {
      userid: null,
      userworkoutid: null,
      totalweightlifted: null,
      repscompleted: null,
    };
  
    // Mock the database query function to simulate no data
    db.query = jest.fn((query, values, callback) => {
      callback(null, []);
    });
  
    const response = await request(app)
      .post('/exerciseprogress')
      .send(requestBody);
  
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'Nothing to post.',
    });
  });
});  
  

describe('POST /userpoints', () => {
  it('should insert increments points in database', async () => {
    // Mock the request body
    const requestBody = {
      userid: 123,
    };



    let earnedpoints = queries.USERPOINTS;

    // Mock the database query function
    db.query = jest.fn((query, values, callback) => {
      expect(query).toEqual(earnedpoints);
      expect(values).toEqual([
        requestBody.userid,
        expect.any(String),
      ]);


      // Simulate a successful database insertion
      callback(null, { userid: 123 });
    });

    // Perform the POST request using supertest
    const response = await request(app)
      .post('/userpoints')
      .send(requestBody);

    // Assertions on the response
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: "success",
      data: { userid: 123 },  
      successMessage: 'Points incremented!',
    });
  });
    
  it('should respond with internal server error if db error is present', async () => {

  
    const requestBody = {
      userid: 123,
    };


    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });
  
    const response = await request(app)
      .post('/userpoints')
      .send(requestBody);
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should respond with 404, if no data is available to post', async () => {
    // Mock the request body
    const requestBody = {
      userid: 123,
    };

    // Mock the database query function to simulate no data
    db.query = jest.fn((query, values, callback) => {
      callback(null, []);
    });
  
    const response = await request(app)
      .post('/userpoints')
      .send(requestBody);
  
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'Nothing to increment.',
    });
  });
});  



describe('POST /addworkoutroutine', () => {
  it('should insert increments points in database', async () => {
    // Mock the request body
    const requestBody = {
      userid: 123,
      day: "Friday",
    };



    let addworkoutroutine = queries.WORKOUTROUTINEINSERTION;

    // Mock the database query function
    db.query = jest.fn((query, values, callback) => {
      expect(query).toEqual(addworkoutroutine);
      expect(values).toEqual([
        requestBody.userid,
        requestBody.day,
      ]);


      // Simulate a successful database insertion
      callback(null, { insertId: 1 });
    });

    // Perform the POST request using supertest
    const response = await request(app)
      .post('/addworkoutroutine')
      .send(requestBody);

    // Assertions on the response
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: "success",
      data: { insertId: 1 },  
      successMessage: 'Workout Routine added!',
    });
  });
    
  it('should respond with internal server error if db error is present', async () => {

  
    const requestBody = {
      userid: 123,
      day: "Friday",
    };

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });
  
    const response = await request(app)
      .post('/addworkoutroutine')
      .send(requestBody);
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should respond with 404, if no data is available to post', async () => {
    // Mock the request body
    const requestBody = {
      userid: 123,
      day: "Friday",
    };


    // Mock the database query function to simulate no data
    db.query = jest.fn((query, values, callback) => {
      callback(null, []);
    });
  
    const response = await request(app)
      .post('/addworkoutroutine')
      .send(requestBody);
  
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'Nothing routine to add.',
    });
  });
});  



describe('POST /addroutinexercises', () => {
  it('should insert routine exercise into database', async () => {
    // Mock the request body
    const requestBody = {
      workoutroutineid: 123,
      userworkoutid: "Friday",
      orderperformed: 1
    };



    let routineexercises = queries.ROUTINEEXERCISEINSERTION;

    // Mock the database query function
    db.query = jest.fn((query, values, callback) => {
      expect(query).toEqual(routineexercises);
      expect(values).toEqual([
        requestBody.workoutroutineid,
        requestBody.userworkoutid,
        requestBody.orderperformed
      ]);


      // Simulate a successful database insertion
      callback(null, { insertId: 1 });
    });

    // Perform the POST request using supertest
    const response = await request(app)
      .post('/addroutineexercises')
      .send(requestBody);

    // Assertions on the response
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: "success",
      data: { insertId: 1 },  
      successMessage: "Routine exercise added!",
    });
  });
    
  it('should respond with internal server error if db error is present', async () => {

  
    const requestBody = {
      workoutroutineid: 123,
      userworkoutid: "Friday",
      orderperformed: 1
    };


    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });
  
    const response = await request(app)
      .post('/addroutineexercises')
      .send(requestBody);
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should respond with 404, if no data is available to post', async () => {
    // Mock the request body
    const requestBody = {
      workoutroutineid: 123,
      userworkoutid: "Friday",
      orderperformed: 1
    };





    // Mock the database query function to simulate no data
    db.query = jest.fn((query, values, callback) => {
      callback(null, []);
    });
  
    const response = await request(app)
      .post('/addroutineexercises')
      .send(requestBody);
  
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No routine exercise found to add.',
    });
  });
});  

describe('POST /addnewuserworkout', () => {
  it('should insert new user workout into database', async () => {
    // Mock the request body
    const requestBody = {
      userid: 123,
      workoutid: 456,
      customliftweight: 200,
      customliftreps: 5,
    };



    let newuserworkout = queries.NEWUSERWORKOUT;

    // Mock the database query function
    db.query = jest.fn((query, values, callback) => {
      expect(query).toEqual(newuserworkout);
      expect(values).toEqual([
        requestBody.userid,
        requestBody.workoutid,
        requestBody.customliftweight,
        requestBody.customliftreps
      ]);


      // Simulate a successful database insertion
      callback(null, { insertId: 1 });
    });

    // Perform the POST request using supertest
    const response = await request(app)
      .post('/addnewuserworkout')
      .send(requestBody);

    // Assertions on the response
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: "success",
      data: { insertId: 1 },  
      successMessage:  "Exercise successfully tracked! Would you like to add another?",
    });
  });
    
  it('should respond with internal server error if db error is present', async () => {

  
    const requestBody = {
      userid: 123,
      workoutid: 456,
      customliftweight: 200,
      customliftreps: 5,
    };



    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });
  
    const response = await request(app)
      .post('/addnewuserworkout')
      .send(requestBody);
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should respond with 404, if no data is available to post', async () => {
    // Mock the request body
    const requestBody = {
      userid: 123,
      workoutid: 456,
      customliftweight: 200,
      customliftreps: 5,
    };





    // Mock the database query function to simulate no data
    db.query = jest.fn((query, values, callback) => {
      callback(null, []);
    });
  
    const response = await request(app)
      .post('/addnewuserworkout')
      .send(requestBody);
  
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No exercise found to track.'
    });
  });
});  


describe('POST /editworkout', () => {
  it('should eid userworkout in database', async () => {
    // Mock the request body

    const mockData = { insertId: 1 }


    const requestBody = {
      userid: 123,
      workoutid: 456,
      customliftweight: 200,
      customliftreps: 5,
    };



    let editworkout = queries.EDITWORKOUT;

    // Mock the database query function
    db.query = jest.fn((query, values, callback) => {
      expect(query).toEqual(editworkout);
      expect(values).toEqual([
        requestBody.userid,
        requestBody.workoutid,
        requestBody.customliftweight,
        requestBody.customliftreps
      ]);
    
      // Simulate a successful database update
      callback(null, { affectedRows: 1 });
    });

    // Perform the POST request using supertest
    const response = await request(app)
      .post('/editworkout')
      .send(requestBody);

    // Assertions on the response
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      data: { affectedRows: 1 },  
      successMessage:  "Exercise successfully edited! Would you like to edit any more?",
    });
  });
    
  it('should respond with internal server error if db error is present', async () => {

  
    const requestBody = {
      userid: 123,
      workoutid: 456,
      customliftweight: 200,
      customliftreps: 5,
    };



    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });
  
    const response = await request(app)
      .post('/editworkout')
      .send(requestBody);
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should respond with 404, if no data is available to post', async () => {
    // Mock the request body
    const requestBody = {
      userid: 123,
      workoutid: 456,
      customliftweight: 200,
      customliftreps: 5,
    };





    // Mock the database query function to simulate no data
    db.query = jest.fn((query, values, callback) => {
      callback(null, { affectedRows: 0 });
    });
  
    const response = await request(app)
      .post('/editworkout')
      .send(requestBody);
  
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: "No exercise found to edit."
    });
  });
});  


describe('POST /register', () => {
  it('should register a user', async () => {
    const requestBody = {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'testpassword',
      emailpreference: 0,
    };


    
    db.query = jest.fn((query, values, callback) => {
      callCount++; // Increment on every call
      
      if (callCount === 1) {
      
        expect(query).toContain('INSERT INTO users');
        expect(values).toEqual([
          requestBody.firstname,
          requestBody.lastname,
          requestBody.username,
          requestBody.email,
          requestBody.password,
          requestBody.emailpreference
        ]);
    
        callback(null, { insertId: 123 }); 
      } 
      else if (callCount === 2) {
       
        expect(query).toContain('INSERT INTO leaderboard');
        expect(values).toEqual([123, 0]);
    
        callback(null, {});
      }
    });


    const response = await request(app)
      .post('/register') 
      .send(requestBody);

    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      userid: 123,
      successMessage: 'Registration has been successful, please login to access the functions of the site!',
    });
  });




  it('should test registration errors', async () => {
    const requestBody = {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'testpassword',
      emailpreference: 0,
    };

    
    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Registration error'));
    });

  
    const response = await request(app)
      .post('/register')
      .send(requestBody);

  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      err: 'User registration failed',
      details: 'Registration error',
    });
  });

  it('should handle leaderboard initialization error', async () => {
    // Mock the request body
    const requestBody = {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'testpassword',
      emailpreference: 0,
    };

    // Mock the db.query function to simulate a successful registration but a leaderboard initialization error
    db.query = jest.fn((query, values, callback) => {
      if (query.includes('INSERT INTO users')) {
        callback(null, { insertId: 123 });
      } else if (query.includes('INSERT INTO leaderboard')) {
        callback(new Error('Leaderboard initialization has failed'));
      }
    });

    // Perform the POST request using supertest
    const response = await request(app)
      .post('/register')
      .send(requestBody);

    // Assertions on the response
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      err: 'Leaderboard initialization has failed',
      details: 'The user was not inserted into the leaderboard',
    });
  });
});

describe('POST /login', () => {
  it('should check user login in the database', async () => {

   

    const requestBody = {
      email: "example@example.com",
      password: "examplepassword",
    };
  
   
    const mockedHashedPassword = await bcrypt.hash(requestBody.password, 10);

    const isValidPassword = await bcrypt.compare(requestBody.password, mockedHashedPassword);
 

    db.query = jest.fn((query, values, callback) => {
      

      if (query.includes('SELECT * FROM users WHERE user_email = ?')) {
        callback(null, [{ userid: 123, user_first_name: "John" }]);
      }
      
    });
  
    const response = await request(app)
      .post('/login')
      .send(requestBody);
  
    expect(response.statusCode).toBe(200);
    expect(isValidPassword).toBe(true);
    expect(response.body.message).toBe("Login successful");
  
    console.log(response.body)
    // Assertions
    expect(response.body.userid).toBe(123);
    expect(response.body.usersName).toBe("John"); 
  });

  it('should check for errors in login', async () => {

   

    const requestBody = {
      email: "example@example.com",
      password: "examplepassword",
    };
  
 


  

      db.query = jest.fn((query, values, callback) => {
      

        if (query.includes('SELECT * FROM users WHERE user_email = ?')) {
          callback(null, []);
          
        }
        
      });
    

  
  
    const response = await request(app)
      .post('/login')
      .send(requestBody);
  
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Login unsuccessful. User not found.");
  
    console.log(response.body)
  });


  it('should check user login in the database with no result', async () => {

   

    const requestBody = {
      email: "example@example.com",
      password: "wrongpassword",
    };
  
   
    const mockedHashedPassword = await bcrypt.hash('examplepassword', 10);


 

    db.query = jest.fn((query, values, callback) => {
      

      if (query.includes('SELECT * FROM users WHERE user_email = ?')) {
        callback(null, [{ userid: 123, user_password: mockedHashedPassword }]);
      }
      
    });
  
    const response = await request(app)
      .post('/login')
      .send(requestBody);
  
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Login unsuccessful. Please check your email and password.");
  
    console.log(response.body)


  });
});

describe('GET /workouts', () => {
  it('should fetch all workouts', async () => {
    // Mocking the expected data to be returned by the database
    const mockData = [
      { workoutroutineid: 1, workoutname: 'Workout 1', workoutdes: "example" },
      { workoutroutineid: 2, workoutname: 'Workout 2', workoutdes: "example2" },
  
    ];

    let getworkouts = queries.WORKOUT
    db.query = jest.fn((query, callback) => {
      if (query === getworkouts ) {
        callback(null, mockData);
      } else {
        callback(new Error('Unexpected SQL or values'));
    }
    });

    const response = await request(app).get('/workouts');

    expect(response.statusCode).toBe(200);

    
    
    expect(response.body).toEqual({
      status: 'success',
      data: mockData
    });
  });


  it('should return internal server error', async () => {
    // Mocking the expected data to be returned by the database


    let getworkouts = queries.WORKOUT

    db.query = jest.fn((query, callback) => {
        callback(new Error('Internal Error'), null);
    });

    const response = await request(app).get('/workouts');

    expect(response.statusCode).toBe(500);

    
    
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should get no data found', async () => {
    // Mocking the expected data to be returned by the database

    let getworkouts = queries.WORKOUT
    db.query = jest.fn((query, callback) => {
    
        callback(null, []);
    });

    const response = await request(app).get('/workouts');

    expect(response.statusCode).toBe(404);

    
    
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No workouts found.'
    });
  });
});


describe('GET /workoutroutines/:userid', () => {
  it('should fetch all workout routines for the user', async () => {

    console.log('db.query mock is called!'); 

      const userid = '123'; // or whatever valid user ID you want to use

      // Mocking the expected data to be returned by the database
      const mockData = [
          { workoutroutineid: 1, userid: 123, day: "Friday" },
          { workoutroutineid: 2, userid: 123, day: "Monday" }
      ];

      let workoutroutines = queries.WORKOUTROUTINES

      // Mocking the db.query function
      db.query = jest.fn((query, userid, callback) => {
          if (query === workoutroutines) {
              callback(null, mockData);
          } else {
              callback(new Error('Unexpected SQL or values'));
          }
      });

      const response = await request(app).get(`/workoutroutines/${userid}`);

      // Assert that the status code is 200 OK
      expect(response.statusCode).toBe(200);

      // Assert that the response body matches the mock data
      expect(response.body).toEqual({
          status: 'success',
          data: mockData
      });
  });

  it('should return internal server error', async () => {
    // Mocking the expected data to be returned by the database


    const userid = 123
    

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Internal Error'), null);
    });


    const response = await request(app).get(`/workoutroutines/${userid}`);

    expect(response.statusCode).toBe(500);

    
    
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should get no data found', async () => {
    // Mocking the expected data to be returned by the database

   
    const userid = 123


  db.query = jest.fn((query, values, callback) => {
  callback(null, []);
    });

    const response = await request(app).get(`/workoutroutines/${userid}`);

    expect(response.statusCode).toBe(404);

    
    
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No workouts found for the given userid'
    });
  });
  

});

describe('GET /workoutdays/:userid', () => {
  it('should fetch all workout days for the user', async () => {


      const userid = 123; 

      // Mocking the expected data to be returned by the database
      const mockData = [
          { workoutroutineid: 1, userid: 123, day: "Friday" },
          { workoutroutineid: 2, userid: 123, day: "Monday" }
      ];

      let workoutdays = queries.WORKOUTDAYS

      // Mocking the db.query function
      db.query = jest.fn((query, userid, callback) => {
          if (query === workoutdays) {
              callback(null, mockData);
          } else {
              callback(new Error('Unexpected SQL or values'));
          }
      });

      const response = await request(app).get(`/workoutdays/${userid}`);

      // Assert that the status code is 200 OK
      expect(response.statusCode).toBe(200);

      // Assert that the response body matches the mock data
      expect(response.body).toEqual({
          status: 'success',
          data: mockData
      });
  });

  it('should return internal server error', async () => {
    // Mocking the expected data to be returned by the database


    const userid = 123
    

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Internal Error'), null);
    });


    const response = await request(app).get(`/workoutdays/${userid}`);

    expect(response.statusCode).toBe(500);

    
    
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should get no data found', async () => {
    // Mocking the expected data to be returned by the database

   
    const userid = 123


  db.query = jest.fn((query, values, callback) => {
  callback(null, []);
    });

    const response = await request(app).get(`/workoutdays/${userid}`);

    expect(response.statusCode).toBe(404);

    
    
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No workouts days for the given userid'
    });
  });
  

});


describe('GET /workoutinfos/:userid', () => {
  it('should fetch all workout infos for the user', async () => {

      const userid = 456; 

      
      const mockData = [
        {userworkoutid: 123,
        userid: 456,
        workoutid: 789,
        customliftweight: 200,
        customliftreps: 20,
        workoutname: "Bench Press",
        workoutdesc: "The Classic!",
        routineexerciseid: 321,
        workoutroutineid: 654,
        orderperformed: 2,
        day: "Friday"},
    ];

      
    let getworkoutinfo = queries.GET_WORKOUT_INFO;

 
    db.query = jest.fn((query, userid, callback) => {
      if (query === getworkoutinfo) {
          callback(null, mockData);
      } else {
          callback(new Error('Unexpected SQL or values'));
      }
  });

      const response = await request(app).get(`/workoutinfos/${userid}`);

      // Expect that the status code is 200 OK
      expect(response.statusCode).toBe(200);

      // Expects that the response body matches the mock data
      expect(response.body).toEqual({
          status: 'success',
          data: mockData
      });
  });

  it('should return internal server error', async () => {
    // Mocking the expected data to be returned by the database


    const userid = 123
    

    db.query = jest.fn((query, userid, callback) => {
      callback(new Error('Internal Error'), null);
    });


    const response = await request(app).get(`/workoutinfos/${userid}`);

    expect(response.statusCode).toBe(500);

    
    
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should get no data found', async () => {
    // Mocking the expected data to be returned by the database

   
    const userid = 123


  db.query = jest.fn((query, values, callback) => {
  callback(null, []);
    });

    const response = await request(app).get(`/workoutinfos/${userid}`);

    expect(response.statusCode).toBe(404);

    
    
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No workouts info found for the given userid'
    });
  });
  

});


describe('GET /userworkouts/:userid', () => {
  it('should fetch all userworkouts days for the user', async () => {


      const userid = '123'; // or whatever valid user ID you want to use

      let userworkoutquery = queries.USERWORKOUTSELECT;

      // Mocking the expected data to be returned by the database
      const mockData = [
          { userworkoutid: 1, userid: 123, customliftweight: 140, workoutname: "Overhead press",  workoutdesc: "Nothing else makes you feel stronger"},
          { userworkoutid: 2, userid: 123, customliftweight: 180, workoutname: "Bench press",  workoutdesc: "The Classic" }
      ];

      

      // Mocking the db.query function
      db.query = jest.fn((query, userid, callback) => {
          if (query === userworkoutquery) {
              callback(null, mockData);
          } else {
              callback(new Error('Unexpected SQL or values'));
          }
      });

      const response = await request(app).get(`/userworkouts/${userid}`);

      // Assert that the status code is 200 OK
      expect(response.statusCode).toBe(200);

      // Assert that the response body matches the mock data
      expect(response.body).toEqual({
          status: 'success',
          data: mockData
      });
  });

  it('should return internal server error', async () => {
    // Mocking the expected data to be returned by the database


    const userid = 123
    

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Internal Error'), null);
    });


    const response = await request(app).get(`/userworkouts/${userid}`);

    expect(response.statusCode).toBe(500);

    
    
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should get no data found', async () => {
    // Mocking the expected data to be returned by the database

   
    const userid = 123


  db.query = jest.fn((query, values, callback) => {
  callback(null, []);
    });

    const response = await request(app).get(`/userworkouts/${userid}`);

    expect(response.statusCode).toBe(404);

    
    
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No workouts found for the given userid'
    });
  });
  

});


describe('GET /tierlist/:userid', () => {
  it('should fetch all user position in tierlist for the user', async () => {


      const userid = '123'; // or whatever valid user ID you want to use

      let tierlistentry = queries.TIERLIST;

      // Mocking the expected data to be returned by the database
      const mockData = [
          {description: "You've been putting the work in and you're already beginning to feel the rewards. Keep it up!", title: "Intermediate",}
      ];

      

      // Mocking the db.query function
      db.query = jest.fn((query, userid, callback) => {
          if (query === tierlistentry) {
              callback(null, mockData);
          } else {
              callback(new Error('Unexpected SQL or values'));
          }
      });

      const response = await request(app).get(`/tierlist/${userid}`);

      // Assert that the status code is 200 OK
      expect(response.statusCode).toBe(200);

      // Assert that the response body matches the mock data
      expect(response.body).toEqual({
          status: 'success',
          data: mockData
      });
  });

  it('should return internal server error', async () => {
    // Mocking the expected data to be returned by the database


    const userid = 123
    

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Internal Error'), null);
    });


    const response = await request(app).get(`/tierlist/${userid}`);

    expect(response.statusCode).toBe(500);

    
    
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should get no data found', async () => {
    // Mocking the expected data to be returned by the database

   
    const userid = 123


  db.query = jest.fn((query, values, callback) => {
  callback(null, []);
    });

    const response = await request(app).get(`/tierlist/${userid}`);

    expect(response.statusCode).toBe(404);

    
    
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'Cannot get user tier position'
    });
  });
  

});


// Also functionally identical to progress infos so it does not need tested
describe('GET /userbarchart/:userid', () => {
  it('should fetch all user progress for the barchart function', async () => {


      const userid = '123'; // or whatever valid user ID you want to use

      let barchart = queries.USERBARCHART;

      // Mocking the expected data to be returned by the database
      const mockData = [
          {progressid: "You've been putting the work in and you're already beginning to feel the rewards. Keep it up!", 
          userid: "Intermediate", 
          userworkoutid: 456, 
          totalweightlifted: 200, 
          repscompleted: 20, 
          timestamp: "2023-08-04T14:04:22.000Z", 
          workoutid: 789,
          customliftweight: 80,
          customliftreps: 5,
          workoutname: "Bench Press",
         workoutdesc: "The Classic!"}
      ];

      

      // Mocking the db.query function
      db.query = jest.fn((query, userid, callback) => {
          if (query === barchart) {
              callback(null, mockData);
          } else {
              callback(new Error('Unexpected SQL or values'));
          }
      });

      const response = await request(app).get(`/userbarchart/${userid}`);

      // Assert that the status code is 200 OK
      expect(response.statusCode).toBe(200);

      // Assert that the response body matches the mock data
      expect(response.body).toEqual({
          status: 'success',
          data: mockData
      });
  });

  it('should return internal server error', async () => {
    // Mocking the expected data to be returned by the database


    const userid = 123
    

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Internal Error'), null);
    });


    const response = await request(app).get(`/userbarchart/${userid}`);

    expect(response.statusCode).toBe(500);

    
    
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should get no data found', async () => {
    // Mocking the expected data to be returned by the database

   
    const userid = 123


  db.query = jest.fn((query, values, callback) => {
  callback(null, []);
    });

    const response = await request(app).get(`/userbarchart/${userid}`);

    expect(response.statusCode).toBe(404);

    
    
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No workouts progress found for the given userid'
    });
  });
  

});

// Leaderboard test
describe('GET /leaderboard', () => {
  it('should fetch all workouts', async () => {
    // Mocking the expected data to be returned by the database
    const mockData = [
      {

        leaderboardid: 123,
        points: 456,
        userid: 789,
        username: "johndoe"

  },
  
    ];

    let leaderboard = queries.LEADERBOARDPOSITIONS
    db.query = jest.fn((query, callback) => {
      if (query === leaderboard ) {
        callback(null, mockData);
      } else {
        callback(new Error('Unexpected SQL or values'));
    }
    });

    const response = await request(app).get('/leaderboard');

    expect(response.statusCode).toBe(200);

    
    
    expect(response.body).toEqual({
      status: 'success',
      data: mockData
    });
  });


  it('should return internal server error', async () => {
    // Mocking the expected data to be returned by the database


    let leaderboard = queries.LEADERBOARDPOSITIONS

    db.query = jest.fn((query, callback) => {
      if (query === leaderboard ) {
        callback(new Error('Internal Error'), null);
      } else {
        callback(new Error('Unexpected SQL or values'));
      }
    });

    const response = await request(app).get('/leaderboard');

    expect(response.statusCode).toBe(500);

    
    
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should get no data found', async () => {
    // Mocking the expected data to be returned by the database

    let leaderboard = queries.LEADERBOARDPOSITIONS
    db.query = jest.fn((query, callback) => {
    
        callback(null, []);
    });

    const response = await request(app).get('/leaderboard');

    expect(response.statusCode).toBe(404);

    
    
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No Leaderboard info found'
    });
  });
});

describe('POST /removeexercise', () => {

  it('should remove the exercise successfully', async () => {
    const mockRoutineExerciseId = 123;
    const mockData = { affectedRows: 1 }; 

    db.query = jest.fn((query, values, callback) => {
      callback(null, mockData);
    });

    const response = await request(app)
      .post('/removeexercise')
      .send({ routineexerciseid: mockRoutineExerciseId });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: mockData,
      deletionMessage: "The exercise has been removed from your routine.",
    });
  });

  it('should return error if database throws an error', async () => {
    const mockRoutineExerciseId = 123;

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });

    const response = await request(app)
      .post('/removeexercise')
      .send({ routineexerciseid: mockRoutineExerciseId });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should return 404 if no exercise found to remove', async () => {
    const mockRoutineExerciseId = 123;
    const mockData = { affectedRows: 0 };

    db.query = jest.fn((query, values, callback) => {
      callback(null, mockData);
    });

    const response = await request(app)
      .post('/removeexercise')
      .send({ routineexerciseid: mockRoutineExerciseId });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No exercise found to remove.',
    });
  });
});

describe('POST /deleteexerciseroutine', () => {
  const reqBody = {userid:123, workoutroutineid: 456}

  it('should remove the exercise successfully', async () => {
  
    const mockData = { affectedRows: 1 }; 

    let deleteexerciseroutine = queries.DELETEWORKOUTROUTINE;
    db.query = jest.fn((query, values, callback) => {
      if (query === deleteexerciseroutine ) {
        callback(null, mockData);
      } else {
        callback(new Error('Unexpected SQL or values'));
      }
      
    });

    const response = await request(app)
      .post('/deleteexerciseroutine')
      .send(reqBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: mockData,
      deletionMessage: "You've removed this routine from your plans.",
    });
  });

  it('should return error if database throws an error', async () => {

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });

    const response = await request(app)
      .post('/deleteexerciseroutine')
      .send(reqBody);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should return 404 if no exercise found to remove', async () => {
    const mockData = { affectedRows: 0 };

    db.query = jest.fn((query, values, callback) => {
      callback(null, mockData);
    });

    const response = await request(app)
      .post('/deleteexerciseroutine')
      .send(reqBody);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No exercise found to remove.',
    });
  });
});



describe('POST /deleteuserworkouts', () => {
  const reqBody = {userid:123, workoutid: 456}

  it('should remove the userworkout successfully', async () => {
  
    const mockData = { affectedRows: 1 }; 

    let deleteuserworkouts = queries.DELETEUSERWORKOUT;

    db.query = jest.fn((query, values, callback) => {
      if (query === deleteuserworkouts ) {
        callback(null, mockData);
      } else {
        callback(new Error('Unexpected SQL or values'));
      }
      
    });

    const response = await request(app)
      .post('/deleteuserworkouts')
      .send(reqBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: mockData,
      deletionMessage: "Your selected exercise is no longer being tracked."
    });
  });

  it('should return error if database throws an error', async () => {

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });

    const response = await request(app)
      .post('/deleteuserworkouts')
      .send(reqBody);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should return 404 if no exercise found to remove', async () => {
    const mockData = { affectedRows: 0 };

    db.query = jest.fn((query, values, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/deleteuserworkouts')
      .send(reqBody);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No tracked exercise found to remove',
    });
  });
});


describe('POST /removeprogress', () => {
  const reqBody = {userid:123, workoutroutineid: 456}

  it('should remove the exercise successfully', async () => {
  
    const mockData = { affectedRows: 1 }; 

    let removeprogress = queries.DELETEPROGRESSINFO;

    let deleteexerciseroutine = queries.DELETEWORKOUTROUTINE;
    db.query = jest.fn((query, values, callback) => {
      if (query === removeprogress ) {
        callback(null, mockData);
      } else {
        callback(new Error('Unexpected SQL or values'));
      }
      
    });

    const response = await request(app)
      .post('/removeprogress')
      .send(reqBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      data: mockData,
      deletionMessage: "Your progress has been successfully reset in this exercise."
    });
  });

  it('should return error if database throws an error', async () => {

    db.query = jest.fn((query, values, callback) => {
      callback(new Error('Simulated DB error'));
    });

    const response = await request(app)
      .post('/removeprogress')
      .send(reqBody);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('should return 404 if no exercise found to remove', async () => {
    const mockData = { affectedRows: 0 };

    db.query = jest.fn((query, values, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/removeprogress')
      .send(reqBody);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'Nothing found',
      message: 'No progress found to be reset',
    });
  });
});