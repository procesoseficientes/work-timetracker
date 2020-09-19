-- Table: public.owner

DROP TABLE IF EXISTS public."time";
DROP TABLE IF EXISTS public.project;
DROP TABLE IF EXISTS public."user";
DROP TABLE IF EXISTS public.owner;
DROP TABLE IF EXISTS public.role;
DROP TABLE IF EXISTS public."access";

CREATE TABLE public.owner
(
    id SERIAL,
    name text COLLATE pg_catalog."default" NOT NULL,
    active boolean NOT NULL DEFAULT true,
    CONSTRAINT owner_pkey PRIMARY KEY (id)
);

-- Table: public."user"

CREATE TABLE public."user"
(
    id SERIAL,
    name text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    active boolean DEFAULT true,
    role_id  integer default 1 not null,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT role_fk foreign key (role_id)
        references public.role (id) match simple
        on UPDATE no action
        on delete no action
);

-- Table: public.project

CREATE TABLE public.project
(
    id SERIAL,
    owner_id integer NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    active boolean NOT NULL DEFAULT true,
    budget numeric NOT NULL DEFAULT 1,
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT owner_fk FOREIGN KEY (owner_id)
        REFERENCES public.owner (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Table: public."time"

CREATE TABLE public."time"
(
    id SERIAL,
    user_id integer NOT NULL,
    owner_id integer NOT NULL,
    project_id integer NOT NULL,
    task text COLLATE pg_catalog."default" NOT NULL,
    start timestamp(6) with time zone NOT NULL,
    "end" timestamp(6) with time zone,
    CONSTRAINT time_pkey PRIMARY KEY (id),
    CONSTRAINT owner_fk FOREIGN KEY (owner_id)
        REFERENCES public.owner (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT project_fk FOREIGN KEY (project_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_fk FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Table: public."role"
create table public.role
(
	id serial not null
		constraint role_pk
			primary key,
	name text not null,
	active boolean not null,
	color text default '#fff'
);

create table public."access"
(
	id serial,
	role_id integer not null,
	route text not null,
	"create" boolean default false not null,
	read boolean default true not null,
	update boolean default false not null,
	delete boolean default false not null,
	constraint access_pk primary key (id),
	constraint role_fk foreign key (role_id)
        references public.role (id) match simple
        on UPDATE no action
        on delete no action
);