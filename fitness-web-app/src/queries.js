
  
  module.exports = {
    GET_WORKOUT_INFO: `SELECT *
    FROM userworkout
    INNER JOIN workouts
    on userworkout.workoutid = workouts.workoutid
    INNER JOIN routineexercises
    ON routineexercises.userworkoutid = userworkout.userworkoutid
    INNER JOIN workoutroutine 
    on workoutroutine.workoutroutineid = routineexercises.workoutroutineid
    WHERE userworkout.userid = ?;`,

    LOGIN: `SELECT * FROM users WHERE user_email = ?`,

    REGISTER: `INSERT INTO users (user_first_name, user_last_name, username, user_email, user_password, emailpreference) VALUES (?, ?, ?, ?, ?, ?);`,

    LEADERBOARD: `INSERT INTO leaderboard (userid, points) values (?, ?);`,

    WORKOUT: `SELECT * FROM workouts`,

    WORKOUTROUTINES: `SELECT * FROM workoutroutine WHERE userid = ?;`,

    WORKOUTDAYS: `SELECT * FROM workoutroutine WHERE workoutroutine.userid = ?;`,

    USERWORKOUTDELETE: `DELETE FROM userworkout WHERE userid = ? AND workoutid = ?`,

    USERWORKOUTSELECT: `SELECT * FROM userworkout INNER JOIN workouts ON userworkout.workoutid = workouts.workoutid WHERE userid = ?`,
  
    EXERCISEPROGRESS: `INSERT INTO exerciseprogress (userid, userworkoutid, totalweightlifted, repscompleted, timestamp) VALUES (?, ?, ?, ?, ?);`,

    USERPOINTS: `INSERT INTO userpoints (userid, earnedat) VALUES (?, ?)`,
  
    POINTTRACKING: `UPDATE leaderboard SET points = points + 1 WHERE userid = ?`,

    WORKOUTROUTINEINSERTION: `INSERT INTO workoutroutine (userid, day) VALUES (?, ?)`,

    ROUTINEEXERCISEINSERTION: `INSERT INTO routineexercises (workoutroutineid, userworkoutid, orderperformed) VALUES (?, ?, ?);`,

    NEWUSERWORKOUT: `INSERT INTO userworkout (userid, workoutid, customliftweight, customliftreps) VALUES (?, ?, ?, ?);`,

    EDITWORKOUT: `UPDATE userworkout SET customliftweight = ?, customliftreps = ? WHERE userid = ? AND workoutid = ?;`,

    TIERLIST : `WITH UserPointsCount as (
      SELECT COUNT(*) AS total_points
      FROM userpoints
      WHERE userid = ?
   ),
   
   TiersAvailable AS (
       SELECT usertier.title, usertier.description, usertier.pointsrequired
       FROM UserPointsCount INNER JOIN usertier on UserPointsCount.total_points >= usertier.pointsrequired
   )
   
   SELECT title, description FROM TiersAvailable ORDER BY pointsrequired DESC LIMIT 1;`,

   USERBARCHART: `SELECT *
    FROM exerciseprogress
    INNER JOIN userworkout
    on exerciseprogress.userworkoutid = userworkout.userworkoutid
    INNER JOIN workouts
    ON userworkout.workoutid = workouts.workoutid
    WHERE exerciseprogress.userid = ?`,


    LEADERBOARDPOSITIONS: `SELECT leaderboard.leaderboardid, leaderboard.points, users.userid, users.username FROM leaderboard INNER JOIN users ON leaderboard.userid = users.userid ORDER by points DESC;`,


    ROUTINEEXERCISEDELETION: `DELETE FROM routineexercises WHERE routineexerciseid = ?`,

    WORKOUTROUTINEDELETION: `DELETE FROM workoutroutine WHERE userid = ? AND workoutroutineid = ?`,

    USERWORKOUTROUTINES: `SELECT * FROM workoutroutine WHERE userid = ?;`,

    GETPROGRESSINFO: `SELECT *
    FROM userworkout
    INNER JOIN workouts
    on userworkout.workoutid = workouts.workoutid
    INNER JOIN exerciseprogress
    on exerciseprogress.userworkoutid = userworkout.userworkoutid
    WHERE userworkout.userid = ?;`,

    DELETEPROGRESSINFO: `DELETE FROM exerciseprogress WHERE userid = ? AND userworkoutid = ?;`,

    DELETEWORKOUTROUTINE: `DELETE FROM workoutroutine WHERE userid = ? AND workoutroutineid = ?`,

    DELETEUSERWORKOUT: `DELETE FROM userworkout WHERE userid = ? AND workoutid = ?`

  };
  

  



  
