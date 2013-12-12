drop database if exists `chat`;

create database chat;

use chat;

drop table if exists `messages`;

create table messages (
  `body` varchar(255) not null,
  `username` varchar(20) not null,
  `createdAt` date not null
);

drop table if exists `users`;

create table users (
  `name` varchar(30) not null,
  `chatroom_id` int(6) default null,
  `createdAt` date not null
);

drop table if exists `chatrooms`;

create table chatrooms (
  `name` varchar(30) not null,
  `createdAt` date not null
);

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
