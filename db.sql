create database purevegi;
use purevegi;

create table buyers_details(
	name varchar(10),
    address varchar(20),
    district varchar(10),
    contact varchar(20),
    password varchar(20),
    constraint buyer_pk primary key(contact)
);

create table seller_details(
	name varchar(10),
    address varchar(20),
    district varchar(10),
    contact varchar(20),
    password varchar(20),
    constraint buyer_pk primary key(contact)
);

create table item(
	id int AUTO_INCREMENT,
	name varchar(10),
    price double,
    quantity int,
    quality varchar(10),
    edate varchar(100),
    mdate varchar(100),
    image varchar(100),
    seller varchar(10),
    constraint item_pk primary key(id)
);

drop table item;

select * from item;

