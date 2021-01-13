/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     1/9/2021 11:42:04 AM                         */
/*==============================================================*/


drop table if exists CATEGORY;

drop table if exists COURSE;

drop table if exists DETAIL;

drop table if exists USER;

drop table if exists USER_COURSE;

drop table if exists WISHLIST;

/*==============================================================*/
/* Table: CATEGORY                                              */
/*==============================================================*/
create table CATEGORY
(
   ID_CATE              int not null,
   CATENAME             varchar(100),
   primary key (ID_CATE)
);

/*==============================================================*/
/* Table: COURSE                                                */
/*==============================================================*/
create table COURSE
(
   ID_COURSE            int not null,
   ID_CATE              int,
   ID_USER              int,
   COURSENAME           varchar(200),
   LENGTH               int,
   CREATEDATE           date,
   LASTUPDATE           date,
   PRICE                float,
   VIEWED               int,
   DESCRIPTION          varchar(500),
   DISCOUNT             float,
   DONE                 bool,
   primary key (ID_COURSE)
);

/*==============================================================*/
/* Table: DETAIL                                                */
/*==============================================================*/
create table DETAIL
(
   ID_DETAIL            int not null,
   ID_COURSE            int,
   LESSONNAME           varchar(50),
   REVIEW               bool not null,
   primary key (ID_DETAIL)
);

/*==============================================================*/
/* Table: USER                                                  */
/*==============================================================*/
create table USER
(
   ID_USER              int not null,
   USERNAME             varchar(20),
   EMAIL                varchar(50),
   PASSWORD             varchar(200),
   TYPE                 int,
   FULLNAME             varchar(50),
   PROFILE              varchar(500),
   primary key (ID_USER)
);

/*==============================================================*/
/* Table: USER_COURSE                                           */
/*==============================================================*/
create table USER_COURSE
(
   ID_USER_COURSE       int not null,
   ID_COURSE            int,
   ID_USER              int,
   RATE                 int,
   FEEDBACK             varchar(500),
   primary key (ID_USER_COURSE)
);

/*==============================================================*/
/* Table: WISHLIST                                              */
/*==============================================================*/
create table WISHLIST
(
   ID_WISHLIST          int not null,
   ID_USER              int,
   ID_COURSE            int,
   primary key (ID_WISHLIST)
);

alter table COURSE add constraint FK_RELATIONSHIP_4 foreign key (ID_CATE)
      references CATEGORY (ID_CATE);

alter table COURSE add constraint FK_RELATIONSHIP_7 foreign key (ID_USER)
      references USER (ID_USER);

alter table DETAIL add constraint FK_RELATIONSHIP_1 foreign key (ID_COURSE)
      references COURSE (ID_COURSE);

alter table USER_COURSE add constraint FK_RELATIONSHIP_8 foreign key (ID_USER)
      references USER (ID_USER);

alter table USER_COURSE add constraint FK_RELATIONSHIP_9 foreign key (ID_COURSE)
      references COURSE (ID_COURSE);

alter table WISHLIST add constraint FK_RELATIONSHIP_5 foreign key (ID_USER)
      references USER (ID_USER);

alter table WISHLIST add constraint FK_RELATIONSHIP_6 foreign key (ID_COURSE)
      references COURSE (ID_COURSE);

