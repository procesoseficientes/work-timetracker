alter table time
	add type_id integer;

create table public.type (
  id serial not null constraint type_pk primary key,
  type text not null, active boolean
);

alter table time
	add constraint type_fk foreign key (type_id)
        references public."type" (id) match simple
        on update no action
        on delete no action

insert into public."type"(type, active) values ('Development', true)
insert into public."type"(type, active) values ('Bug fixing', true)
insert into public."type"(type, active) values ('Support', true)
insert into public."type"(type, active) values ('Meeting', true)
insert into public."type"(type, active) values ('Other', true)