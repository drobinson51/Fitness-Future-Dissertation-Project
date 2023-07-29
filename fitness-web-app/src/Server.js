const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 4000,
  cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const schedule = require("node-schedule");


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

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dylan.robinson99@gmail.com",
    //gmail pass
    pass: "vsljiwadktcikjne",
  },
});



schedule.scheduleJob("30 * * * 7", () => {
  const emailcheck =
    "SELECT * FROM users INNER JOIN workoutroutine on users.userid = workoutroutine.userid INNER JOIN routineexercises ON workoutroutine.workoutroutineid = routineexercises.workoutroutineid WHERE users.emailpreference = 1;";

  db.query(emailcheck, async (err, rows) => {
    if (err) throw err;

  //creates a map which is the basis of the storing data for the query
    const userEmailsMap = new Map();

    //iterates through the results
    rows.forEach((row) => { 
      const userEmail = row.user_email;
      const workoutday = row.day;
      const userName = row.user_first_name;


      //simple if else, if the map has the value it pushes the days into the array contained in the map

      if (userEmailsMap.has(userEmail)) {
        userData.workoutdays.add(workoutday);

        // if it does not have the userEmail it creates a new entity in the map that stores the userEmail, name and days they are going
      } else {
        // Create a new entry for the user in the map
        userEmailsMap.set(userEmail, userData = {
          userName: userName,  
          workoutdays: new Set([workoutday])
        });
      }
    });



    //for loop through the useremail map, with a key of userEmail and a value of userData, which contains the username and the userworkoutdays as a set
    for (const [userEmail, userData] of userEmailsMap) {

      const option = {
        from: "dylan.robinson99@gmail.com",
        to: userEmail,
        subject: "Test",
        text:
          "Hello " +
          userData.userName +
          " I hope this finds you well. I am reminding you that you have some workouts to get done this week. You're going to be hitting the gym this week on " +
          Array.from(userData.workoutdays).join(", ") + " best of luck and hope you kill it!"
      };

      transporter.sendMail(option, (error, info) => {
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
    if (err) throw err;
    let numRows = rows.length;

    if (numRows > 0) {
      const storedHashedPassword = rows[0].user_password;
      const validPass = await bcrypt.compare(password, storedHashedPassword);

      if (validPass) {
        console.log("login successful");
        const userid = rows[0].userid;
        res.status(200).json({ message: "Login successful", userid });
      } else {
        console.log("login unsuccessful");
        res.status(200).json({ message: "Login unsuccessful" });
      }
    } else {
      res.status(200).json({ message: "Login unsuccessful due to error" });
    }
  });
});

app.post("/register", async (req, res) => {
  const { firstname, lastname, username, email, password, emailpreference } = req.body;

  let userreg =
    "INSERT INTO users (user_first_name, user_last_name, username, user_email, user_password, emailpreference) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(userreg, [firstname, lastname, username, email, password, emailpreference],
    (err, data) => {
      if (err) throw err;

      const userid = data.insertId

      const baseScore = 0;

      const leaderboardInitialisation = 'INSERT INTO leaderboard (userid, points) values (?, ?)';
  

      db.query(leaderboardInitialisation, [userid, baseScore],
        (err, data) => {
          if (err) throw err;


          res.json({ userid: userid, data: data });
        })
     
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
  WHERE userworkout.userid = ?;`

  db.query(getworkoutinfo, [userid], (err, data) => {
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
    res.json({ data });
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
      res.json({ data });
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

     
  let pointTracking = 'UPDATE leaderboard SET points = points + 1 WHERE userid = ?';


  db.query(pointTracking, [userid], (err, data) => {
    if(err) throw err;

    res.json({ userid: userid, data: data });
  })
});

app.post("/addworkoutroutine", async (req, res) => {
  const { userid, day } = req.body;

  let workoutroutine = `INSERT INTO workoutroutine (userid, day) VALUES (?, ?)`;

  db.query(workoutroutine, [userid, day], (err, data) => {
    if (err) throw err;
    res.json({ data });
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
      res.json({ data });
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
      res.json({ data });
    }
  );
});

app.post("/editworkout", async (req, res) => {
  const { userid, workoutid, customliftweight, customliftreps } = req.body;

  let updateWorkout = `UPDATE userworkout SET customliftweight = ?, customliftreps = ? WHERE userid = ? AND workoutid = ?`;

  db.query(updateWorkout, [customliftweight, customliftreps, userid, workoutid],
    (err, data) => {
      if (err) throw err;
      res.json({ data });
    }
  );
});

app.get("/tierlist/:userid", async (req, res) => {

  const { userid } = req.params;

  let tierlistentry = 'SELECT t.title FROM (SELECT COUNT(*) AS total_points FROM userpoints WHERE userid = ? ) AS up JOIN usertier AS t ON up.total_points >= t.pointsrequired ORDER BY t.pointsrequired DESC LIMIT 1;'

  db.query(tierlistentry, [userid], (err, data) => {
    if(err) throw err;

    res.json ({data});
  });
}); 


app.get("/userbarchart/:userid", async (req, res) => {

  const { userid } = req.params;

  let tierlistentry =`SELECT *
  FROM exerciseprogress
  INNER JOIN userworkout
  on exerciseprogress.userworkoutid = userworkout.userworkoutid
  INNER JOIN workouts
  ON userworkout.workoutid = workouts.workoutid
  INNER JOIN routineexercises
  on routineexercises.userworkoutid = userworkout.userworkoutid
WHERE exerciseprogress.userid = 6`;

  db.query(tierlistentry, [userid], (err, data) => {
    if(err) throw err;

    res.json ({data});
  });
}); 



app.get("/leaderboard/", async (req, res) => {



  let leaderboard = 'SELECT * FROM leaderboard INNER JOIN users ON leaderboard.userid = users.userid;'

  db.query(leaderboard, (err, data) => {
    if(err) throw err;

    res.json ({data});
  });
}); 


app.post("/removeexercise", async (req, res) => {
  const {routineexerciseid } = req.body;

  let routineexercise = `DELETE FROM routineexercises WHERE routineexerciseid = ?`;

  db.query(routineexercise, [routineexerciseid], (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});


app.post("/deleteexerciseroutine", async (req, res) => {
  const {userid, workoutroutineid } = req.body;

  let workoutroutine = `DELETE FROM workoutroutine WHERE userid = ? AND workoutroutineid = ?`;

  db.query(workoutroutine, [userid, workoutroutineid], (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});


app.get("/exerciseroutines/:userid", async (req, res) => {

  const { userid } = req.params;

  let workoutroutinesavailable =`SELECT * FROM workoutroutine WHERE userid = ?`;

  db.query(workoutroutinesavailable, [userid], (err, data) => {
    if(err) throw err;

    res.json ({data});
  });
}); 

