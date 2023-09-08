-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 08, 2023 at 04:25 PM
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
  `totalweightlifted` decimal(10,0) NOT NULL,
  `repscompleted` decimal(10,0) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `exerciseprogress`
--

INSERT INTO `exerciseprogress` (`progressid`, `userid`, `userworkoutid`, `totalweightlifted`, `repscompleted`, `timestamp`) VALUES
(6, 5, 6, '130', '6', '2023-07-17 17:28:50'),
(7, 5, 6, '130', '6', '2023-07-17 17:31:15'),
(12, 6, 18, '880', '12', '2023-08-01 15:31:17'),
(13, 6, 19, '200', '25', '2023-08-04 14:04:22'),
(14, 6, 18, '140', '20', '2023-08-04 14:04:22'),
(15, 6, 19, '840', '30', '2023-08-04 14:09:27'),
(16, 6, 18, '1500', '30', '2023-07-13 14:09:27'),
(17, 6, 19, '6000', '40', '2023-08-12 13:08:12'),
(18, 6, 18, '8000', '25', '2023-08-12 13:08:12'),
(19, 6, 19, '6000', '40', '2023-08-12 13:09:10'),
(20, 6, 18, '8000', '25', '2023-08-12 13:09:10'),
(25, 36, 24, '900', '30', '2023-08-22 14:35:21'),
(28, 6, 19, '8000', '100', '2023-08-28 17:14:55'),
(31, 6, 19, '125', '25', '2023-08-28 17:32:04'),
(32, 6, 18, '125', '25', '2023-08-28 17:32:04'),
(33, 6, 19, '1', '1', '2023-08-28 17:32:56'),
(34, 6, 18, '1', '1', '2023-08-28 17:32:56'),
(35, 6, 19, '40', '2', '2023-08-28 17:35:07'),
(36, 6, 18, '8', '4', '2023-08-28 17:35:07'),
(37, 6, 12, '12', '4', '2023-08-28 17:35:57'),
(38, 6, 12, '8', '4', '2023-08-28 17:37:04'),
(39, 6, 12, '1', '-1', '2023-08-28 17:44:40'),
(41, 39, 26, '750', '25', '2023-09-03 13:59:17'),
(43, 43, 27, '1925', '35', '2023-09-05 12:15:43'),
(44, 43, 27, '125', '25', '2023-09-05 12:23:34'),
(45, 43, 27, '125', '25', '2023-09-05 12:25:32'),
(64, 54, 41, '1750', '25', '2023-09-08 09:51:59'),
(65, 54, 43, '1750', '25', '2023-09-08 09:51:59'),
(66, 54, 44, '1750', '25', '2023-09-08 09:51:59'),
(67, 6, 19, '1', '1', '2023-09-08 12:14:56'),
(68, 6, 18, '1', '1', '2023-09-08 12:14:56');

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `leaderboardid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `leaderboard`
--

INSERT INTO `leaderboard` (`leaderboardid`, `userid`, `points`) VALUES
(1, 12, 0),
(2, 13, 0),
(3, 14, 0),
(4, 6, 13),
(24, 34, 0),
(26, 36, 1),
(30, 39, 0),
(34, 43, 0),
(41, 50, 1),
(45, 54, 2);

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
(13, 8, 14, 1),
(15, 7, 12, 1),
(16, 5, 18, 1),
(17, 5, 19, 2),
(28, 39, 23, 1),
(29, 39, 24, 2),
(43, 45, 27, 1),
(56, 62, 41, 1),
(57, 62, 43, 2),
(59, 62, 44, 3),
(60, 61, 43, 1),
(61, 61, 44, 3),
(62, 61, 41, 2),
(63, 63, 41, 1),
(64, 63, 43, 1);

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
(1, 5, '2023-07-17 18:31:15'),
(2, 5, '2023-07-25 15:57:52'),
(3, 5, '2023-07-25 15:57:52'),
(4, 5, '2023-07-25 15:57:52'),
(5, 5, '2023-07-25 15:57:52'),
(6, 5, '2023-07-25 15:57:52'),
(7, 6, '2023-07-26 14:25:01'),
(8, 6, '2023-08-01 15:55:14'),
(9, 6, '2023-08-01 15:55:23'),
(10, 6, '2023-08-01 16:31:17'),
(11, 6, '2023-08-04 11:12:14'),
(12, 6, '2023-08-04 15:09:27'),
(13, 6, '2023-08-12 14:08:12'),
(14, 6, '2023-08-12 14:09:10'),
(15, 6, '2023-08-12 17:01:25'),
(16, 6, '2023-08-12 18:04:00'),
(17, 6, '2023-08-21 19:57:01'),
(18, 36, '2023-08-22 15:35:21'),
(19, 6, '2023-08-26 12:38:29'),
(20, 6, '2023-08-28 18:22:07'),
(21, 6, '2023-08-28 18:22:21'),
(22, 6, '2023-08-28 18:22:43'),
(23, 6, '2023-08-28 18:23:15'),
(24, 6, '2023-08-28 18:24:45'),
(25, 6, '2023-08-28 18:27:37'),
(26, 6, '2023-08-28 18:27:50'),
(27, 6, '2023-08-28 18:30:45'),
(28, 6, '2023-08-28 18:31:19'),
(29, 6, '2023-08-28 18:32:04'),
(30, 6, '2023-08-28 18:32:46'),
(31, 6, '2023-08-28 18:32:56'),
(32, 6, '2023-08-28 18:35:07'),
(33, 6, '2023-08-28 18:35:57'),
(34, 6, '2023-08-28 18:37:04'),
(35, 6, '2023-08-28 18:37:36'),
(36, 6, '2023-08-28 18:39:01'),
(37, 6, '2023-08-28 18:44:40'),
(38, 6, '2023-08-28 18:44:57'),
(39, 6, '2023-08-28 18:45:22'),
(40, 6, '2023-08-28 18:45:45'),
(41, 6, '2023-08-28 18:46:15'),
(42, 6, '2023-08-28 18:46:46'),
(43, 39, '2023-09-03 14:59:17'),
(44, 43, '2023-09-05 13:15:43'),
(45, 43, '2023-09-05 13:23:34'),
(56, 50, '2023-09-05 16:33:08'),
(60, 54, '2023-09-07 20:21:47'),
(61, 54, '2023-09-08 10:51:59'),
(62, 6, '2023-09-08 13:14:56');

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
(5, 'R.', 'R.', '', 'defaultemail@defaultemail.com', '$2a$10$bAuLKMpe7jVekn4Zt/38yuTB3Q4V/w6Tj8n6qOnqVqJjob5hBb8gK', 0),
(6, 'D', 'R.', 'DR.', 'defaultemail@defaultemail.com', '$2a$10$UkI3dhcVsQt9/PpGNMjPU.SDGCj7kJ6D6lciQSQIADTnKs9N2drBG', 1),
(7, 'D.', 'R.', 'origin', 'defaultemail@defaultemail.com', '$2a$10$Bj9rlnggzqUo0Gn6s4KH8u7roX.wIlYkBxAi67W003zKmw7cQEEki', 0),
(8, 'Joseph', 'Roberts', 'jobert', 'joebob@bobert.com', '$2a$10$25pQ/cTIdowasdNgBIPl8O7FJNoMemWXu2QdPYMqQ4phA.duNf1Ua', 0),
(9, 'Joseph', 'Roberts', 'jobert', 'joebob@bobert.com', '$2a$10$GDPMK2rRecNzuLAC07fmDeX0PFZWWt.n5E3FJn9NEnA0lKUhke.oK', 0),
(10, 'Joseph', 'Roberts', 'jobert', 'joebob@bobert.com', '$2a$10$RXJu6jPB.KMCkSTX7TWPtOBhTBE50ksXTLXWFmPhj8L0EcmUlOF4G', 0),
(11, 'Joseph', 'Roberts', 'jobert', 'joebob@bobert.com', '$2a$10$RQAlAcCnffqpGn34.b0g1uXRbDQyv8Sb4E8/zwq7lHeOxCuPLlCmm', 0),
(12, 'Joseph', 'Roberts', 'jobert', 'joebob@bobert.com', '$2a$10$NRvzVMLlEX47ywE6iEBVrOF0rYp9VxCgjUQuqo57t.k55BZbXnWdq', 0),
(13, 'Rob', 'Rob', 'robrob', 'robrob@gkem.com', '$2a$10$F/YlPeCAq5dx5j2SVgqh3ewTAsYG8zst.XPQHmK3sm14Aobz1NeVq', 0),
(14, 'Rob', 'Rob', 'robrob', 'robrob@gkem.com', '$2a$10$23L9JygXtJOsEpdHY8qOFeP/sWO8EM/dCLT4F75HnNifncHdagOc6', 0),
(34, 'Robert', 'Frost', 'robbob', 'bobio@bob.com', '$2a$10$rVBRZ9.FzEjd40hSAvu9BOm3AFTlUAb0qcDhIQcLUovNvLSB0OzzK', 0),
(36, 'C.', 'R.', 'CR.', 'exampleEmail@example.com', '$2a$10$cQgrOFb4PktBZgxoe.k8keBwo3xGmPTp7aNgv9/3jHDWm.R032EGe', 0),
(39, 'Test', 'Account', 'Test', 'example@example.com', '$2a$10$WR4ci4RnDgaqpLZEc4hvMO4VeA6Vg10LxnFFm4nSObfZfOapSYCFC', 0),
(43, 'Project', 'Test', 'ProjectTest', 'projecttest@example.com', '$2a$10$9Frs9zReXwZ9k/oBULd5oucuwHt8spX5FiuStc8QMJO05nfBIGHAS', 0),
(50, 'Video', 'R.', 'VideoDemonstration', 'VideoDemonstration@example.com', '$2a$10$et..r5GlkusfUt0nab.Hb.dlnNQize8aUEGlVN0aHOP3uqqvYDj/.', 0),
(54, 'Final', 'Runthrough', 'finalrunthrough', 'finalrunthrough@example.com', '$2a$10$TXzOrPB1wV76eQmfbsUUee6C3NluL8kZqFauMoLJV9UMVPTtJ81dy', 0);

-- --------------------------------------------------------

--
-- Table structure for table `usertier`
--

CREATE TABLE `usertier` (
  `usertierid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `pointsrequired` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `usertier`
--

INSERT INTO `usertier` (`usertierid`, `title`, `description`, `pointsrequired`) VALUES
(1, 'Beginner', 'You\'ve just started at this thing! But everyones has got to start somewhere! Keep at it champ and good things will happen.', 0),
(2, 'Intermediate', 'You\'ve been putting the work in and you\'re already beginning to feel the rewards. Keep it up!', 5),
(3, 'Advanced', 'You\'ve been doing quite well, your consistency has been good and you\'ve completed tons of your routines day by day. The only way to go is up, no?', 15),
(4, 'Elite', 'You\'ve been at it for quite a while, honestly you might not even need the encouragement. But anyways good job! Keep on pushing and keep killing it!', 25),
(5, 'Champion', 'You\'ve crushed it! Someone like you is determined to the extreme, keep this up and I guarantee you\'ll succeed in not just your fitness goals but whatever else you put your mind to. ', 50);

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
(7, 5, 2, '145.00', 3),
(9, 5, 3, '55.00', 6),
(12, 6, 3, '140.00', 5),
(14, 5, 2, '140.00', 5),
(17, 6, 2, '150.00', 10),
(18, 6, 2, '180.00', 2),
(19, 6, 1, '80.00', 5),
(21, 1, 3, '125.00', 20),
(23, 36, 1, '82.00', 6),
(24, 36, 4, '30.00', 10),
(25, 39, 2, '51.00', 5),
(26, 39, 1, '30.00', 5),
(27, 43, 1, '50.00', 5),
(41, 54, 1, '70.00', 6),
(43, 54, 2, '100.00', 5),
(44, 54, 3, '60.00', 5);

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
(8, 5, 'Friday'),
(1, 5, 'Tuesday'),
(5, 6, 'Friday'),
(7, 6, 'Monday'),
(44, 6, 'Thursday'),
(39, 36, 'Tuesday'),
(45, 43, 'Tuesday'),
(56, 50, 'Wednesday'),
(61, 54, 'Monday'),
(62, 54, 'Tuesday'),
(63, 54, 'Wednesday');

-- --------------------------------------------------------

--
-- Table structure for table `workouts`
--

CREATE TABLE `workouts` (
  `workoutid` int(11) NOT NULL,
  `workoutname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workouts`
--

INSERT INTO `workouts` (`workoutid`, `workoutname`) VALUES
(1, 'Bench Press'),
(2, 'Deadlift'),
(3, 'Overhead press'),
(4, 'Lateral Raises'),
(5, 'Lateral Pulldowns');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exerciseprogress`
--
ALTER TABLE `exerciseprogress`
  ADD PRIMARY KEY (`progressid`),
  ADD KEY `FK_user_userid_6` (`userid`),
  ADD KEY `FK_userworkout_userworkoutid2` (`userworkoutid`);

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
  ADD KEY `FK_userworkout_userworkoutid` (`userworkoutid`),
  ADD KEY `FK_workoutroutine_workoutroutineid` (`workoutroutineid`);

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
  ADD UNIQUE KEY `uniqueuserday` (`userid`,`day`);

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
  MODIFY `progressid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `leaderboardid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `routineexercises`
--
ALTER TABLE `routineexercises`
  MODIFY `routineexerciseid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `userpoints`
--
ALTER TABLE `userpoints`
  MODIFY `userpoints_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `usertier`
--
ALTER TABLE `usertier`
  MODIFY `usertierid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userworkout`
--
ALTER TABLE `userworkout`
  MODIFY `userworkoutid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `workoutroutine`
--
ALTER TABLE `workoutroutine`
  MODIFY `workoutroutineid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `workouts`
--
ALTER TABLE `workouts`
  MODIFY `workoutid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exerciseprogress`
--
ALTER TABLE `exerciseprogress`
  ADD CONSTRAINT `FK_user_userid_6` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `FK_userworkout_userworkoutid2` FOREIGN KEY (`userworkoutid`) REFERENCES `userworkout` (`userworkoutid`) ON DELETE CASCADE;

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `FK_user_userid_4` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE;

--
-- Constraints for table `routineexercises`
--
ALTER TABLE `routineexercises`
  ADD CONSTRAINT `FK_userworkout_userworkoutid` FOREIGN KEY (`userworkoutid`) REFERENCES `userworkout` (`userworkoutid`),
  ADD CONSTRAINT `FK_workoutroutine_workoutroutineid` FOREIGN KEY (`workoutroutineid`) REFERENCES `workoutroutine` (`workoutroutineid`) ON DELETE CASCADE;

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
