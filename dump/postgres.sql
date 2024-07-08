-- Active: 1720099914221@@127.0.0.1@5432@postgres
DROP SCHEMA IF EXISTS branas;
CREATE SCHEMA IF NOT EXISTS branas;

create table branas.events (
  event_id uuid primary key,
  description varchar(255) not null,
  price numeric(10,2) not null
);


create table branas.tickets (
  ticket_id uuid primary key,
  event_id uuid not null,
  email varchar(255) not null,
  price numeric(10,2) not null
);

insert into branas.events (event_id, description, price) 
values ('550e8400-e29b-41d4-a716-446655440000', 'Event 1', 100.00);