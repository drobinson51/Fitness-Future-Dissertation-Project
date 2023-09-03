
const queries = require ("./queries.js")
const express = require("express"),
  app = express(),
  PORT = 4000,
  cors = require("cors");

const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");



require("dotenv").config();


let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fitnessapp",
  port: "3306",
});


// This Helps with creating separation of test environment to real server environment allowing mocking to work properly due to how Jest hoists

let isConnected = false;

const connectToDb = () => {
  if (isConnected) return;

  db.connect((err) => {
    console.log("Connected to DB");
    if (err) throw err;
  });

  isConnected = true;
};

if (require.main === module) {
  connectToDb();
}

app.use(cors());
app.use(express.json());
app.listen(PORT, () => console.log("Backend server live on " + PORT));

app.get("/", (req, res) => {
  res.send({ message: "Connection established!" });
});







//declaration of transporter to be use by nodecron to send email, provides the details required to the API. 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILSENDER,

    pass: process.env.PASSWORD,
  },
});


// The logic of how the mail shall be sent  it gathers the two below functions and runs them to create the email that shall be sent
const sendWeeklyMail = (err, rows) => {
  if (err) throw err;

  const userEmailsData = getUserEmailsData(rows);

  for (const [userEmail, userData] of userEmailsData) {
      const mailOptions = emailLayoutOptions(userEmail, userData);
      
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error("Error sending email:", error);
          } else {
              console.log("Mail sent successfully!", info);
          }
      });
  }
};



// Extraction of data from received info.
const getUserEmailsData = (rows) => {
  const userEmailsData = new Map();

  rows.forEach((row) => {
      const userEmail = row.user_email;
      const workoutDay = row.day;
      const userName = row.user_first_name;
      const workoutName = row.workoutname;
      const weight = row.customliftweight;
      const reps = row.customliftreps;

      if (userEmailsData.has(userEmail)) {
          const userData = userEmailsData.get(userEmail);
          if (userData[workoutDay]) {
              userData[workoutDay].push({
                  workoutname: workoutName,
                  weight: weight,
                  reps: reps,
              });
          } else {
              userData[workoutDay] = [{
                  workoutname: workoutName,
                  weight: weight,
                  reps: reps,
              }];
          }
      } else {
          userEmailsData.set(userEmail, {
              userName: userName,
              [workoutDay]: [{
                  workoutname: workoutName,
                  weight: weight,
                  reps: reps,
              }],
          });
      }
  });

  return userEmailsData;
};

// Email construction, how it is layed out 
const emailLayoutOptions = (userEmail, userData) => {
  let text = `Hello ${userData.userName}, I hope this finds you in fitness and health. I am reminding you that you have some workouts to get done this week. You're going to be hitting the gym this week, your workouts are as follows below:`;

  for (const workoutDay in userData) {
      if (workoutDay !== "userName" && workoutDay !== "workoutdays") {
          text += `\n\n${workoutDay} workouts:\n`;
          userData[workoutDay].forEach((workout) => {
              text += ` - ${workout.workoutname}: ${workout.weight} kg, ${workout.reps} reps\n`;
          });
      }
  }

  text += `\n Regards from Fitness Future, you've got this!`;

  return {
      from: process.env.EMAILSENDER,
      to: userEmail,
      subject: "Fitness Future: Your Workout Schedule for the Week",
      text: text,
  };
};


schedule.scheduleJob("28 16 * * 6", () => {
  const emailCheckQuery = `
      SELECT * FROM users 
      INNER JOIN workoutroutine ON users.userid = workoutroutine.userid 
      INNER JOIN routineexercises ON workoutroutine.workoutroutineid = routineexercises.workoutroutineid 
      INNER JOIN userworkout ON routineexercises.userworkoutid = userworkout.userworkoutid 
      INNER JOIN workouts ON userworkout.workoutid = workouts.workoutid WHERE users.emailpreference = 1
  `;

  // Calling the job, running these two together creates the email 
  db.query(emailCheckQuery, sendWeeklyMail);
});




app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let checkuser = "SELECT * FROM users WHERE user_email = ?";

  db.query(checkuser, [email], async (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ message: "An error occurred during login." });
    }

    let numRows = rows.length;

    if (numRows > 0) {
      const storedHashedPassword = rows[0].user_password;
      const validPass = await bcrypt.compare(password, storedHashedPassword);

      if (validPass) {
        console.log("login successful");
        const userid = rows[0].userid;
        const usersName = rows[0].user_first_name;
        return res.status(200).json({ message: "Login successful", userid, usersName });
      } else {
        console.log("login unsuccessful");
        return res.status(401).json({
            message:
              "Login unsuccessful. Please check your email and password.",
          });
      }
    } else {
      return res.status(401).json({ message: "Login unsuccessful. User not found." });
    }
  });
});




app.post("/register", async (req, res) => {
  const { firstname, lastname, username, email, password, emailpreference } =
    req.body;

  let userreg =
    "INSERT INTO users (user_first_name, user_last_name, username, user_email, user_password, emailpreference) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    userreg,
    [firstname, lastname, username, email, password, emailpreference],
    (insertError, data) => {
      if (insertError) {
        return res.status(500).json({ err: "User registration failed", details: "Registration error" });
      }
      const userid = data.insertId;

      const baseScore = 0;

      const leaderboardInitialisation =
        "INSERT INTO leaderboard (userid, points) values (?, ?)";

      db.query(leaderboardInitialisation, [userid, baseScore], (leaderboardError, data) => {
        if (leaderboardError) {
          return res.status(500).json({ err: "Leaderboard initialization has failed", details: "The user was not inserted into the leaderboard" });
        }

        const successMessage =
          "Registration has been successful, please login to access the functions of the site!";
        res.json({ userid: userid, successMessage: successMessage });
      });
    }
  );
});


app.get("/workouts", async (req, res) => {
  let getworkouts = queries.WORKOUT

  db.query(getworkouts, (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No workouts found.'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});

app.get("/workoutroutines/:userid", async (req, res) => {
  const { userid } = req.params;

  let getworkoutroutines = queries.WORKOUTROUTINES


  db.query(getworkoutroutines, [userid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No workouts found for the given userid'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});

app.get("/routineexercises/:workoutroutineid", async (req, res) => {
  const { workoutroutineid } = req.params;

  let getroutinexercises = queries.ROUTINEEXERCISES;


  db.query(getroutinexercises, [workoutroutineid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No workout routines found for the given userid'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});



app.get("/workoutinfos/:userid", async (req, res) => {
  const { userid } = req.params;

  let getworkoutinfo = queries.GET_WORKOUT_INFO;

db.query(getworkoutinfo, [userid], (err, data) => {
  if (err) {
    console.error("Error fetching workouts:", err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      status: 'Nothing found',
      message: 'No workouts info found for the given userid'
    });
  }

  res.status(200).json({
    status: 'success',
    data: data
  });
});
});


app.get("/workoutdays/:userid", async (req, res) => {
  const { userid } = req.params;

  let getworkoutdaysinfo = queries.WORKOUTDAYS;

  db.query(getworkoutdaysinfo, [userid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No workouts days for the given userid'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});

app.get("/userworkouts/:userid", async (req, res) => {
  const { userid } = req.params;

  let userworkouts = queries.USERWORKOUTSELECT

  db.query(userworkouts, [userid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No workouts found for the given userid'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});

app.post("/deleteuserworkouts", async (req, res) => {
  const { userid, workoutid } = req.body;

  let removeuserworkout = queries.DELETEUSERWORKOUT

  db.query(removeuserworkout, [userid, workoutid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No tracked exercise found to remove',
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data,
      deletionMessage: "Your selected exercise is no longer being tracked."
    });
  });
});

app.post("/exerciseprogress", async (req, res) => {
  const {
    userid,
    userworkoutid,
   totalweightlifted,
    repscompleted,
  } = req.body;

  const timestamp = new Date().toISOString();

  let exerciseprogress = queries.EXERCISEPROGRESS



  db.query(exerciseprogress, [userid, userworkoutid,  totalweightlifted,  repscompleted, timestamp], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'Nothing to post.'
      });
    }
  
    res.status(201).json({
      status: 'success',
      data: data,
      successMessage: "Nice workout you killed it! Keep it up.",
    });
  });
});

app.post("/userpoints", async (req, res) => {
  const { userid } = req.body;

  const earnedat = new Date().toISOString();

  let earnedpoints = queries.USERPOINTS;

db.query(earnedpoints, [userid, earnedat], (err, data) => {
  if (err) {
    console.error("Error fetching workouts:", err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      status: 'Nothing found',
      message: 'Nothing to increment.'
    });
  }

  res.status(201).json({
    status: 'success',
    data: {userid: data.userid},
    successMessage: "Points incremented!",
  });
});
});


app.post("/addworkoutroutine", async (req, res) => {
  const { userid, day } = req.body;

  let workoutroutine = queries.WORKOUTROUTINEINSERTION

  db.query(workoutroutine, [userid, day], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'Nothing routine to add.'
      });
    }
  
    res.status(201).json({
      status: 'success',
      data: {insertId: data.insertId},
      successMessage: "Workout Routine added!",
    });
  });
  });

app.post("/addroutineexercises", async (req, res) => {
  const { workoutroutineid, userworkoutid, orderperformed } = req.body;

  let routineexercises = queries.ROUTINEEXERCISEINSERTION;

  db.query(routineexercises, [workoutroutineid, userworkoutid, orderperformed], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No routine exercise found to add.'
      });
    }
  
    res.status(201).json({
      status: 'success',
      data: {insertId: data.insertId},
      successMessage: "Routine exercise added!",
    });
  });
  });

//API handling of letting user create a new custom workout, selects a workout and lets them select their target goals for it.
app.post("/addnewuserworkout", async (req, res) => {
  const { userid, workoutid, customliftweight, customliftreps } = req.body;
  let newuserworkout = queries.NEWUSERWORKOUT;

    db.query(newuserworkout, [userid, workoutid, customliftweight, customliftreps], (err, data) => {
      if (err) {
        console.error("Error fetching workouts:", err);
        return res.status(500).json({
          status: 'error',
          message: 'Internal Server Error'
        });
      }
    
      if (!data || data.length === 0) {
        return res.status(404).json({
          status: 'Nothing found',
          message: 'No exercise found to track.'
        });
      }
    
      res.status(201).json({
        status: 'success',
        data: {insertId: data.insertId},
        successMessage: "Exercise successfully tracked! Would you like to add another?",
      });
    });
    });

app.post("/editworkout", async (req, res) => {


  const { userid, workoutid, customliftweight, customliftreps } = req.body;
      let editworkout = queries.EDITWORKOUT;
    
      db.query(editworkout, [customliftweight, customliftreps, userid, workoutid], (err, data) => {
        if (err) {
          console.error("Error fetching workouts:", err);
          return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
          });
        }
    
        if (!data || data.affectedRows === 0) {
          return res.status(404).json({
            status: 'Nothing found',
            message: 'No exercise found to edit.'
          });
        }
    
        res.status(200).json({
          status: 'success',
          data: data,
          successMessage: "Exercise successfully edited! Would you like to edit any more?",
        });
      });
    });

app.get("/tierlist/:userid", async (req, res) => {
  const { userid } = req.params;

  // Query logic for comparison of user points against table. Two structures are created and populated from the two tables selected
  // The count takes every users point assigned, and then stores it to be compared against the TiersAvailable which will assign a tier based on the points
  // This information is then displayed at the end. 
  let tierlistentry = queries.TIERLIST

  db.query(tierlistentry, [userid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'Cannot get user tier position'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});

app.get("/userbarchart/:userid", async (req, res) => {
  const { userid } = req.params;

  let barchartdata = queries.USERBARCHART

  db.query(barchartdata, [userid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No workouts progress found for the given userid'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});

app.get("/leaderboard/", async (req, res) => {
  let leaderboard = queries.LEADERBOARDPOSITIONS;

    db.query(leaderboard, (err, data) => {
      if (err) {
        console.error("Error fetching workouts:", err);
        return res.status(500).json({
          status: 'error',
          message: 'Internal Server Error'
        });
      }
    
      if (!data || data.length === 0) {
        return res.status(404).json({
          status: 'Nothing found',
          message: 'No Leaderboard info found'
        });
      }
    
      res.status(200).json({
        status: 'success',
        data: data
      });
    });
  });


app.post("/removeexercise", async (req, res) => {
  const { routineexerciseid } = req.body;

  let removeroutineexercise = queries.ROUTINEEXERCISEDELETION;

  db.query(removeroutineexercise, [routineexerciseid], (err, data) => {
    if (err) {
      console.error("Error removing routine exercise:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
    
    if (!data || data.affectedRows === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No exercise found to remove.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: data,
      deletionMessage: "The exercise has been removed from your routine.",
    });
  });
});

app.post("/deleteexerciseroutine", async (req, res) => {
  const { userid, workoutroutineid } = req.body;

  let workoutroutine = queries.DELETEWORKOUTROUTINE

  db.query(workoutroutine, [userid, workoutroutineid], (err, data) => {
    if (err) {
      console.error("Error removing routine exercise:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
    
    if (!data || data.affectedRows === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No exercise found to remove.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: data,
      deletionMessage: "You've removed this routine from your plans.",
    });
  });
});


app.get("/exerciseroutines/:userid", async (req, res) => {
  const { userid } = req.params;

  let workoutroutinesavailable = queries.WORKOUTROUTINES;

  db.query(workoutroutinesavailable, [userid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(200).json({
        status: 'Nothing found',
        message: 'No routines found for the given userid'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});

app.get("/progressinfos/:userid", async (req, res) => {
  const { userid } = req.params;

  let getprogressinfo = queries.GETPROGRESSINFO;

  
  db.query(getprogressinfo, [userid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No workouts found for the given userid'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data
    });
  });
});


app.post("/removeprogress", async (req, res) => {
  const { userid, userworkoutid } = req.body;

  let removeprogress = queries.DELETEPROGRESSINFO

  db.query(removeprogress, [userid, userworkoutid], (err, data) => {
    if (err) {
      console.error("Error fetching workouts:", err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 'Nothing found',
        message: 'No progress found to be reset'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: data,
      deletionMessage: "Your progress has been successfully reset in this exercise."
    });
  });
});


module.exports = {
  app, 
  db,
  connectToDb,
  sendWeeklyMail,
  getUserEmailsData,
  emailLayoutOptions
}
