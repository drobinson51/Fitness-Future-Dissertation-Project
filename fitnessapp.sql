-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2023 at 10:12 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fitnessapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `exerciseprogress`
--

CREATE TABLE `exerciseprogress` (
  `progressid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `userworkoutid` int(11) NOT NULL,
  `routineexerciseid` int(11) NOT NULL,
  `totalweightlifted` decimal(10,0) NOT NULL,
  `repscompleted` decimal(10,0) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `exerciseprogress`
--

INSERT INTO `exerciseprogress` (`progressid`, `userid`, `userworkoutid`, `routineexerciseid`, `totalweightlifted`, `repscompleted`, `timestamp`) VALUES
(5, 5, 7, 3, '15000', '20', '2023-07-16 15:21:28'),
(6, 5, 6, 4, '130', '6', '2023-07-17 17:28:50'),
(7, 5, 6, 4, '130', '6', '2023-07-17 17:31:15');

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `leaderboardid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `routineexercises`
--

CREATE TABLE `routineexercises` (
  `routineexerciseid` int(11) NOT NULL,
  `workoutroutineid` int(11) NOT NULL,
  `userworkoutid` int(11) NOT NULL,
  `orderperformed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `routineexercises`
--

INSERT INTO `routineexercises` (`routineexerciseid`, `workoutroutineid`, `userworkoutid`, `orderperformed`) VALUES
(3, 1, 7, 3),
(4, 1, 6, 1),
(6, 1, 7, 7);

-- --------------------------------------------------------

--
-- Table structure for table `userpoints`
--

CREATE TABLE `userpoints` (
  `userpoints_id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `earnedat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userpoints`
--

INSERT INTO `userpoints` (`userpoints_id`, `userid`, `earnedat`) VALUES
(1, 5, '2023-07-17 18:31:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `user_first_name` varchar(255) NOT NULL,
  `user_last_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `emailpreference` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `user_first_name`, `user_last_name`, `username`, `user_email`, `user_password`, `emailpreference`) VALUES
(1, 'Robert', 'Parr', '', 'bob@hotmail.com', 'password', 0),
(2, 'Ron', 'Burgundy', '', 'bob@123.com', 'pass', 0),
(3, 'John', 'Doe', '', 'test@example.com', 'test123', 0),
(4, 'John', 'Samples', '', 'test2@example.com', '$2a$10$bNk7BtheOAN2ecP2hmn7y.2K.JrsDs..nwkNjJsH3przRO237UC2O', 0),
(5, 'Ryan', 'Robinson', '', 'colin.robinson99@gmail.com', '$2a$10$bAuLKMpe7jVekn4Zt/38yuTB3Q4V/w6Tj8n6qOnqVqJjob5hBb8gK', 0),
(6, 'Dylan', 'Robinson', 'drobin', 'dylan.robinson991@outlook.com', '$2a$10$UkI3dhcVsQt9/PpGNMjPU.SDGCj7kJ6D6lciQSQIADTnKs9N2drBG', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usertier`
--

CREATE TABLE `usertier` (
  `usertierid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `pointsrequired` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `usertier`
--

INSERT INTO `usertier` (`usertierid`, `title`, `pointsrequired`) VALUES
(1, 'Beginner', 0),
(2, 'Intermediate', 5),
(3, 'Advanced', 15),
(4, 'Elite', 25),
(5, 'Champion', 50);

-- --------------------------------------------------------

--
-- Table structure for table `userworkout`
--

CREATE TABLE `userworkout` (
  `userworkoutid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `workoutid` int(11) NOT NULL,
  `customliftweight` decimal(8,2) NOT NULL,
  `customliftreps` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userworkout`
--

INSERT INTO `userworkout` (`userworkoutid`, `userid`, `workoutid`, `customliftweight`, `customliftreps`) VALUES
(6, 5, 1, '140.00', 7),
(7, 5, 2, '140.00', 3),
(9, 5, 3, '55.00', 6);

-- --------------------------------------------------------

--
-- Table structure for table `workoutroutine`
--

CREATE TABLE `workoutroutine` (
  `workoutroutineid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `day` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workoutroutine`
--

INSERT INTO `workoutroutine` (`workoutroutineid`, `userid`, `day`) VALUES
(1, 5, 'Tuesday');

-- --------------------------------------------------------

--
-- Table structure for table `workouts`
--

CREATE TABLE `workouts` (
  `workoutid` int(11) NOT NULL,
  `workoutname` varchar(255) NOT NULL,
  `workoutdesc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workouts`
--

INSERT INTO `workouts` (`workoutid`, `workoutname`, `workoutdesc`) VALUES
(1, 'Bench Press', 'The Classic!'),
(2, 'Deadlift', 'The endurance tester!'),
(3, 'Overhead press', 'Nothing makes you feel stronger than lifitng a heavy weight over your head and putting it back down again.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exerciseprogress`
--
ALTER TABLE `exerciseprogress`
  ADD PRIMARY KEY (`progressid`),
  ADD KEY `FK_user_userid_6` (`userid`),
  ADD KEY `FK_userworkout_userworkoutid2` (`userworkoutid`),
  ADD KEY `FK_routineexercise_routineexerciseid` (`routineexerciseid`);

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`leaderboardid`),
  ADD KEY `FK_user_userid_4` (`userid`);

--
-- Indexes for table `routineexercises`
--
ALTER TABLE `routineexercises`
  ADD PRIMARY KEY (`routineexerciseid`),
  ADD KEY `FK_workoutroutine_workoutroutineid` (`workoutroutineid`),
  ADD KEY `FK_userworkout_userworkoutid` (`userworkoutid`);

--
-- Indexes for table `userpoints`
--
ALTER TABLE `userpoints`
  ADD PRIMARY KEY (`userpoints_id`),
  ADD KEY `FK_user_user_id` (`userid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`);

--
-- Indexes for table `usertier`
--
ALTER TABLE `usertier`
  ADD PRIMARY KEY (`usertierid`);

--
-- Indexes for table `userworkout`
--
ALTER TABLE `userworkout`
  ADD PRIMARY KEY (`userworkoutid`),
  ADD KEY `FK_users_userid` (`userid`),
  ADD KEY `FK_workouts_workoutid` (`workoutid`);

--
-- Indexes for table `workoutroutine`
--
ALTER TABLE `workoutroutine`
  ADD PRIMARY KEY (`workoutroutineid`),
  ADD KEY `FK_user_userid_5` (`userid`);

--
-- Indexes for table `workouts`
--
ALTER TABLE `workouts`
  ADD PRIMARY KEY (`workoutid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exerciseprogress`
--
ALTER TABLE `exerciseprogress`
  MODIFY `progressid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `leaderboardid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `routineexercises`
--
ALTER TABLE `routineexercises`
  MODIFY `routineexerciseid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `userpoints`
--
ALTER TABLE `userpoints`
  MODIFY `userpoints_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `usertier`
--
ALTER TABLE `usertier`
  MODIFY `usertierid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userworkout`
--
ALTER TABLE `userworkout`
  MODIFY `userworkoutid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `workoutroutine`
--
ALTER TABLE `workoutroutine`
  MODIFY `workoutroutineid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `workouts`
--
ALTER TABLE `workouts`
  MODIFY `workoutid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exerciseprogress`
--
ALTER TABLE `exerciseprogress`
  ADD CONSTRAINT `FK_routineexercise_routineexerciseid` FOREIGN KEY (`routineexerciseid`) REFERENCES `routineexercises` (`routineexerciseid`),
  ADD CONSTRAINT `FK_user_userid_6` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `FK_userworkout_userworkoutid2` FOREIGN KEY (`userworkoutid`) REFERENCES `userworkout` (`userworkoutid`);

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `FK_user_userid_4` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);

--
-- Constraints for table `routineexercises`
--
ALTER TABLE `routineexercises`
  ADD CONSTRAINT `FK_userworkout_userworkoutid` FOREIGN KEY (`userworkoutid`) REFERENCES `userworkout` (`userworkoutid`),
  ADD CONSTRAINT `FK_workoutroutine_workoutroutineid` FOREIGN KEY (`workoutroutineid`) REFERENCES `workoutroutine` (`workoutroutineid`);

--
-- Constraints for table `userpoints`
--
ALTER TABLE `userpoints`
  ADD CONSTRAINT `FK_user_user_id` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);

--
-- Constraints for table `userworkout`
--
ALTER TABLE `userworkout`
  ADD CONSTRAINT `FK_users_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `FK_workouts_workoutid` FOREIGN KEY (`workoutid`) REFERENCES `workouts` (`workoutid`);

--
-- Constraints for table `workoutroutine`
--
ALTER TABLE `workoutroutine`
  ADD CONSTRAINT `FK_user_userid_5` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
