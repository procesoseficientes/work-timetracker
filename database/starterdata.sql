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