drop table if exists public."time";
drop table if exists public.project;
drop table if exists public."user";
drop table if exists public.owner;
drop table if exists public.type;
drop table if exists public."access";
drop table if exists public.role;

-- table: public.owner
create table public.owner (
  id serial,
  name text collate pg_catalog."default" not null,
  active boolean not null default true,
  constraint owner_pkey primary key (id)
);

-- table: public."type"
create table public.type (
  id serial not null constraint type_pk primary key,
  type text not null, active boolean
);

-- table: public."role"
create table public.role (
  id serial not null constraint role_pk primary key,
  name text not null,
  active boolean not null,
  color text default '#fff'
);

-- table: public."user"
create table public."user" (
  id serial,
  name text collate pg_catalog."default" not null,
  username text collate pg_catalog."default" not null,
  password text collate pg_catalog."default" not null,
  active boolean default true,
  role_id integer default 1 not null,
  constraint user_pkey primary key (id),
  constraint username_unique unique (username),
  constraint role_fk foreign key (role_id)
    references public.role (id) match simple
    on update no action
    on delete no action
);

-- table: public.project
create table public.project (
  id serial,
  owner_id integer not null,
  name text collate pg_catalog."default" not null,
  description text collate pg_catalog."default",
  active boolean not null default true,
  budget numeric not null default 1,
  constraint projects_pkey primary key (id),
  constraint owner_fk foreign key (owner_id)
    references public.owner (id) match simple
    on update no action
    on delete no action
);

-- table: public.time
create table public."time"
(
    id serial,
    user_id integer not null,
    owner_id integer not null,
    project_id integer not null,
    type_id integer default null,
    task text collate pg_catalog."default" not null,
    start timestamp(6) with time zone not null,
    "end" timestamp(6) with time zone,
    constraint time_pkey primary key (id),
    constraint owner_fk foreign key (owner_id)
        references public.owner (id) match simple
        on update no action
        on delete no action,
    constraint project_fk foreign key (project_id)
        references public.project (id) match simple
        on update no action
        on delete no action,
    constraint user_fk foreign key (user_id)
        references public."user" (id) match simple
        on update no action
        on delete no action,
    constraint type_fk foreign key (type_id)
        references public."type" (id) match simple
        on update no action
        on delete no action
);

-- table: public."access"
create table public."access" (
  id serial,
  role_id integer not null,
  route text not null,
  "create" boolean default false not null,
  read boolean default true not null,
  update
    boolean default false not null,
    delete boolean default false not null,
    constraint access_pk primary key (id),
    constraint role_fk foreign key (role_id)
        references public.role (id) match simple
        on update no action
        on delete no action
);