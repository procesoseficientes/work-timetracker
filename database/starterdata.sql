-- Owner inserts
-- You can use the following script to easily create insert queries
---- string.split('\n').map(a => a.split(' ')).map(a => `INSERT INTO public.owner(\nid, name, active)\nVALUES (${a[0]}, '${a[1]}', '${a[2]}');`).reduce((a, n) => `${a}\n\n${n}`)

INSERT INTO public.owner(
name, active)
VALUES ('FERCO', 't');

INSERT INTO public.owner(
name, active)
VALUES ('Arium', 't');

INSERT INTO public.owner(
name, active)
VALUES ('Alza', 't');

INSERT INTO public.owner(
name, active)
VALUES ('Cendalza', 't');

INSERT INTO public.owner(
name, active)
VALUES ('Procesos Eficientes', 't');

INSERT INTO public.owner(
id, name)
VALUES (0, 'Personal (lunch/break/other)');

insert into public.role(name, active)
values ('Administrator', true);

-- User inserts
INSERT INTO public."user"(
	name, username, password, active)
	VALUES ('Fabrizio Delcompare', 'fabrizio.delcompare', '123', 't');

INSERT INTO public."user"(
	name, username, password, active)
	VALUES ('Juan Jose Elgueta', 'juan.elgueta', '123', 't');

INSERT INTO public."user"(
	name, username, password, active)
	VALUES ('Gustavo Garcia', 'gustavo.garcia', '123', 't');

INSERT INTO public."user"(
	name, username, password, active)
	VALUES ('Eira Delcompare', 'eira.delcompare', '123', 't');

INSERT INTO public."user"(
	name, username, password, active)
	VALUES ('Marvin Canel', 'marvin.canel', '123', 't');

INSERT INTO public.project(owner_id, name, description, budget)
VALUES (0, 'Lunch/Break', 'Section of time schedulded for lunchs and breaks, budget is based on 1.5 hours for 7 team members', 53);

insert into public.access(role_id, route, "create", read, update, delete)
values (1, '/', true, true, true, true);

insert into public.access(role_id, route, "create", read, update, delete)
values (1, '/team', true, true, true, true);

insert into public.access(role_id, route, "create", read, update, delete)
values (1, '/users', true, true, true, true);

insert into public.access(role_id, route, "create", read, update, delete)
values (1, '/projects', true, true, true, true);

insert into public.access(role_id, route, "create", read, update, delete)
values (1, '/owners', true, true, true, true);

insert into public."type"(type, active) values ('Development', true)
insert into public."type"(type, active) values ('Bug fixing', true)
insert into public."type"(type, active) values ('Support', true)
insert into public."type"(type, active) values ('Meeting', true)
insert into public."type"(type, active) values ('Other', true)