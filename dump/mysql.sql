-- Active: 1715796784859@@127.0.0.1@3306
drop database if exists branas;
create database if not exists branas;

create table branas.events (
  event_id varchar(255) primary key,
  description varchar(255) not null,
  price decimal not null
);

create table branas.tickets (
  ticket_id varchar(255) primary key,
  event_id varchar(255) not null,
  email varchar(255) not null,
  price numeric(10,2) not null
);

insert into branas.events (event_id, description, price) 
values ('550e8400-e29b-41d4-a716-446655440000', 'Event 1', 100.00);