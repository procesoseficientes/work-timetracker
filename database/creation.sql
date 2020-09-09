-- Table: public.owner

-- DROP TABLE public.owner;

CREATE TABLE public.owner
(
    id SERIAL,
    name text COLLATE pg_catalog."default" NOT NULL,
    active boolean NOT NULL DEFAULT true,
    CONSTRAINT owner_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

-- Table: public."user"

-- DROP TABLE public."user";

CREATE TABLE public."user"
(
    id SERIAL,
    name text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    active boolean DEFAULT true,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT username_unique UNIQUE (username)

)

TABLESPACE pg_default;

-- Table: public.project

-- DROP TABLE public.project;

CREATE TABLE public.project
(
    id SERIAL,
    owner_id integer NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    active boolean NOT NULL DEFAULT true,
    CONSTRAINT proyects_pkey PRIMARY KEY (id),
    CONSTRAINT owner_fk FOREIGN KEY (owner_id)
        REFERENCES public.owner (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

-- Table: public."time"

-- DROP TABLE public."time";

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
    CONSTRAINT proyect_fk FOREIGN KEY (project_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_fk FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;