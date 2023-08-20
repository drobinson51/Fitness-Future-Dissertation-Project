const express = require("express"),
  app = express(),
  PORT = 4000,
  cors = require("cors");

const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const schedule = require("node-schedule");
const emailSender = "fitnessfuturecsc7057@gmail.com";
const emailPassword = "kienpsctlbziezkn";

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fitnessapp",
  port: "3306",
});

db.connect((err) => {
  console.log("Connected to DB");
  if (err) throw err;
});

app.use(cors());
app.use(express.json());
app.listen(PORT, () => console.log("Backend server live on " + PORT));

app.get("/", (req, res) => {
  res.send({ message: "Connection established!" });
});

app.listen(8000);


// nodecron test
cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});


//declaration of transporter to be use by nodecron to send email, provides the details required to the API. 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailSender,

    pass: emailPassword,
  },
});


// Email function through nodecron 
schedule.scheduleJob("04 17 * * 4", () => {
  const emailCheckQuery =
    // SQL query to get the data needed to send the emails
    `SELECT * FROM users 
    INNER JOIN workoutroutine ON users.userid = workoutroutine.userid 
    INNER JOIN routineexercises ON workoutroutine.workoutroutineid = routineexercises.workoutroutineid 
    INNER JOIN userworkout ON routineexercises.userworkoutid = userworkout.userworkoutid 
    INNER JOIN workouts ON userworkout.workoutid = workouts.workoutid WHERE users.emailpreference = 1`

  db.query(emailCheckQuery, async (err, rows) => {
    if (err) throw err;

    // map of the user data, the key is the userEmail,
    const userEmailsData = new Map();

    // Iterates through the results, which is stored as rows
    rows.forEach((row) => {
      const userEmail = row.user_email;
      const workoutDay = row.day;
      const userName = row.user_first_name;
      const workoutName = row.workoutname;
      const weight = row.customliftweight;
      const reps = row.customliftreps;

      //checks for the key and starts the process of populating the map
      if (userEmailsData.has(userEmail)) {
        //gets the info of the line on that day that shares that userEmail
        const userData = userEmailsData.get(userEmail);

        if (userData[workoutDay]) {
          // If the workout day is already stored, adds the workout data to the array
          userData[workoutDay].push({
            workoutname: workoutName,
            weight: weight,
            reps: reps,
          });
        } else {
          // If the workout day is not stored, the array is created and the info added.
          userData[workoutDay] = [
            {
              workoutname: workoutName,
              weight: weight,
              reps: reps,
            },
          ];
        }
      } else {
        // If the userEmail is not in the map, created a key for it and create the structure for the array that will be in said map
        userEmailsData.set(userEmail, userData = {
          userName: userName,
          [workoutDay]: [
            {
              // Adds workout values to the day that is found
              workoutname: workoutName,
              weight: weight,
              reps: reps,
            },
          ],
        });
      }
    });

    // For loop through the emails, and userData of the userEmailsData allowing access to all the variables needed to send the text
    for (const [userEmail, userData] of userEmailsData) {
      //gets the username from the userData

      let text = `Hello ${userData.userName}, I hope this finds you in fitness and health. I am reminding you that you have some workouts to get done this week. You're going to be hitting the gym this week, your workouts are as follows below:`;

      // For loop through the userData which creates variables to be sent to the user's email
      for (const workoutDay in userData) {
        if (workoutDay !== "userName" && workoutDay !== "workoutdays") {
          //new line for some spacing and asethetic look
          text += `\n\n${workoutDay} workouts:\n`;
          userData[workoutDay].forEach((workout) => {
            text += ` - ${workout.workoutname}: ${workout.weight} kg, ${workout.reps} reps\n`;
          });
        }
      }

      text += `\n Regards from Fitness Future, you've got this!`

      //how the mail is sent, the emailsender is defined at the top of the document, and the userEmail is derived from its key in the map. You then sent it the text which has been defined in the above function
      const mailOptions = {
        from: emailsender,
        to: userEmail,
        subject: "Fitness Future: Your Workout Schedule for the Week",
        text: text,
      };

      //the email is sent, it gives either an error or sends back info proving it was sent fine.

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Mail sent successfully!", info);
        }
      });
    }
  });
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
    (err, data) => {
      if (err) throw err;

      const userid = data.insertId;

      const baseScore = 0;

      const leaderboardInitialisation =
        "INSERT INTO leaderboard (userid, points) values (?, ?)";

      db.query(leaderboardInitialisation, [userid, baseScore], (err, data) => {
        if (err) throw err;

        const successMessage =
          "Registration has been successful, please login to access the functions of the site!";
        res.json({ userid: userid, successMessage: successMessage });
      });
    }
  );
});

app.get("/workouts", async (req, res) => {
  let getworkouts = `SELECT *
  FROM workouts`;

  db.query(getworkouts, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

app.get("/workoutroutines/:userid", async (req, res) => {
  const { userid } = req.params;

  let getworkoutroutines = `SELECT *
  FROM workoutroutine WHERE userid = ?`;

  db.query(getworkoutroutines, [userid], (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

app.get("/workoutinfos/:userid", async (req, res) => {
  const { userid } = req.params;

  let getworkoutinfo = `SELECT *
  FROM userworkout
  INNER JOIN workouts
  on userworkout.workoutid = workouts.workoutid
  INNER JOIN routineexercises
  ON routineexercises.userworkoutid = userworkout.userworkoutid
  INNER JOIN workoutroutine 
  on workoutroutine.workoutroutineid = routineexercises.workoutroutineid
  WHERE userworkout.userid = ?;`;

  db.query(getworkoutinfo, [userid], (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

app.get("/workoutdays/:userid", async (req, res) => {
  const { userid } = req.params;

  let getworkoutdaysinfo = `SELECT *
  FROM workoutroutine  WHERE workoutroutine.userid = ?;`;

  db.query(getworkoutdaysinfo, [userid], (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

app.get("/userworkouts/:userid", async (req, res) => {
  const { userid } = req.params;

  let userworkouts = `SELECT *
  FROM userworkout
  INNER JOIN workouts
  ON userworkout.workoutid = workouts.workoutid
  WHERE userid = ?;`;

  db.query(userworkouts, [userid], (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

app.post("/deleteuserworkouts", async (req, res) => {
  const { userid, workoutid } = req.body;

  let userworkouts = `DELETE FROM userworkout WHERE userid = ? AND workoutid = ?`;

  db.query(userworkouts, [userid, workoutid], (err, data) => {
    if (err) throw err;
    res.json({ data, message: "Workout has been successfully deleted." });
  });
});

app.post("/exerciseprogress", async (req, res) => {
  const {
    userid,
    userworkoutid,
    routineexerciseid,
    totalweightlifted,
    repscompleted,
  } = req.body;

  const timestamp = new Date().toISOString();

  let exerciseprogress = `INSERT INTO exerciseprogress (userid, userworkoutid, routineexerciseid, totalweightlifted, repscompleted, timestamp) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    exerciseprogress,
    [
      userid,
      userworkoutid,
      routineexerciseid,
      totalweightlifted,
      repscompleted,
      timestamp,
    ],
    (err, data) => {
      if (err) throw err;
      res.json({
        data,
        successMessage: "Nice workout you killed it! Keep it up.",
      });
    }
  );
});

app.post("/userpoints", async (req, res) => {
  const { userid } = req.body;

  const earnedat = new Date().toISOString();

  let earnedpoints = `INSERT INTO userpoints (userid, earnedat) VALUES (?, ?)`;

  db.query(earnedpoints, [userid, earnedat], (err, data) => {
    if (err) throw err;
  });

  let pointTracking =
    "UPDATE leaderboard SET points = points + 1 WHERE userid = ?";

  db.query(pointTracking, [userid], (err, data) => {
    if (err) throw err;

    res.json({ userid: userid, data: data });
  });
});

app.post("/addworkoutroutine", async (req, res) => {
  const { userid, day } = req.body;

  let workoutroutine = `INSERT INTO workoutroutine (userid, day) VALUES (?, ?)`;

  db.query(workoutroutine, [userid, day], (err, data) => {
    if (err) throw err;
    res.json({
      data,
      successMessage:
        "Congratulations, you've created a routine. Would you like to make another?",
    });
  });
});

app.post("/addroutineexercises", async (req, res) => {
  const { workoutroutineid, userworkoutid, orderperformed } = req.body;

  let routineexercises = `INSERT INTO routineexercises (workoutroutineid, userworkoutid, orderperformed) VALUES (?, ?, ?)`;

  db.query(
    routineexercises,
    [workoutroutineid, userworkoutid, orderperformed],
    (err, data) => {
      if (err) throw err;
      res.json({
        data,
        successMessage:
          "You've added the workout to the routine, would you like to add another?",
      });
    }
  );
});

//API handling of letting user create a new custom workout, selects a workout and lets them select their target goals for it.
app.post("/addnewuserworkout", async (req, res) => {
  const { userid, workoutid, customliftweight, customliftreps } = req.body;
  let newuserworkout =
    "INSERT INTO userworkout (userid, workoutid, customliftweight, customliftreps) VALUES (?, ?, ?, ?)";

  db.query(
    newuserworkout,
    [userid, workoutid, customliftweight, customliftreps],
    (err, data) => {
      if (err) throw err;
      res.json({
        data,
        successMessage:
          "You've created a personal exercise for use and tracking, would you like to add more?",
      });
    }
  );
});

app.post("/editworkout", async (req, res) => {
  const { userid, workoutid, customliftweight, customliftreps } = req.body;

  let updateWorkout = `UPDATE userworkout SET customliftweight = ?, customliftreps = ? WHERE userid = ? AND workoutid = ?`;

  db.query(
    updateWorkout,
    [customliftweight, customliftreps, userid, workoutid],
    (err, data) => {
      if (err) throw err;
      res.json({
        data,
        successMessage:
          "The selected message has been edited to match your revised values.",
      });
    }
  );
});

app.get("/tierlist/:userid", async (req, res) => {
  const { userid } = req.params;

  // Query logic for comparison of user points against table. Two structures are created and populated from the two tables selected
  // The count takes every users point assigned, and then stores it to be compared against the TiersAvailable which will assign a tier based on the points
  // This information is then displayed at the end. 
  let tierlistentry =
    `WITH UserPointsCount as (
      SELECT COUNT(*) AS total_points
      FROM userpoints
      WHERE userid = ?
   ),
   
   TiersAvailable AS (
       SELECT usertier.title, usertier.description, usertier.pointsrequired
       FROM UserPointsCount INNER JOIN usertier on UserPointsCount.total_points >= usertier.pointsrequired
   )
   
   SELECT title, description FROM TiersAvailable ORDER BY pointsrequired DESC LIMIT 1;`

  db.query(tierlistentry, [userid], (err, data) => {
    if (err) throw err;

    res.json({ data });
  });
});


app.get("/userbarchart/:userid", async (req, res) => {
  const { userid } = req.params;

  let tierlistentry = `SELECT *
  FROM exerciseprogress
  INNER JOIN userworkout
  on exerciseprogress.userworkoutid = userworkout.userworkoutid
  INNER JOIN workouts
  ON userworkout.workoutid = workouts.workoutid
  INNER JOIN routineexercises
  on routineexercises.userworkoutid = userworkout.userworkoutid
WHERE exerciseprogress.userid = ?`;

  db.query(tierlistentry, [userid], (err, data) => {
    if (err) throw err;

    res.json({ data });
  });
});

app.get("/leaderboard/", async (req, res) => {
  let leaderboard =
    "SELECT * FROM leaderboard INNER JOIN users ON leaderboard.userid = users.userid ORDER by points DESC;";

  db.query(leaderboard, (err, data) => {
    if (err) throw err;

    res.json({ data });
  });
});

app.post("/removeexercise", async (req, res) => {
  const { routineexerciseid } = req.body;

  let routineexercise = `DELETE FROM routineexercises WHERE routineexerciseid = ?`;

  db.query(routineexercise, [routineexerciseid], (err, data) => {
    if (err) throw err;
    res.json({
      data,
      deletionMessage: "The exercise has been removed from your routine.",
    });
  });
});

app.post("/deleteexerciseroutine", async (req, res) => {
  const { userid, workoutroutineid } = req.body;

  let workoutroutine = `DELETE FROM workoutroutine WHERE userid = ? AND workoutroutineid = ?`;

  db.query(workoutroutine, [userid, workoutroutineid], (err, data) => {
    if (err) throw err;
    res.json({
      data,
      deletionMessage: "You've removed this routine from your plans.",
    });
  });
});

app.get("/exerciseroutines/:userid", async (req, res) => {
  const { userid } = req.params;

  let workoutroutinesavailable = `SELECT * FROM workoutroutine WHERE userid = ?`;

  db.query(workoutroutinesavailable, [userid], (err, data) => {
    if (err) throw err;

    res.json({ data });
  });
});

app.get("/progressinfos/:userid", async (req, res) => {
  const { userid } = req.params;

  let getprogressinfo = `SELECT *
  FROM userworkout
  INNER JOIN workouts
  on userworkout.workoutid = workouts.workoutid
  INNER JOIN routineexercises
  ON routineexercises.userworkoutid = userworkout.userworkoutid
  INNER JOIN workoutroutine 
  on workoutroutine.workoutroutineid = routineexercises.workoutroutineid
  INNER JOIN exerciseprogress
  on exerciseprogress.userworkoutid = userworkout.userworkoutid
  WHERE userworkout.userid = ?;`;

  db.query(getprogressinfo, [userid], (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

app.post("/removeprogress", async (req, res) => {
  const { userid, userworkoutid } = req.body;

  let workoutroutine = `DELETE FROM exerciseprogress WHERE userid = ? AND userworkoutid = ?`;

  db.query(workoutroutine, [userid, userworkoutid], (err, data) => {
    if (err) throw err;
    res.json({
      data,
      deletionMessage: "You've reset your progress in this exercise.",
    });
  });
});
