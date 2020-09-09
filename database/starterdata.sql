-- Owner inserts
-- You can use the following script to easily create insert queries
---- string.split('\n').map(a => a.split(' ')).map(a => `INSERT INTO public.owner(\nid, name, active)\nVALUES (${a[0]}, '${a[1]}', '${a[2]}');`).reduce((a, n) => `${a}\n\n${n}`)

INSERT INTO public.owner(
id, name, active)
VALUES (1, 'FERCO', 't');

INSERT INTO public.owner(
id, name, active)
VALUES (2, 'Arium', 't');

INSERT INTO public.owner(
id, name, active)
VALUES (3, 'Alza', 't');

INSERT INTO public.owner(
id, name, active)
VALUES (4, 'Cendalza', 't');

-- User inserts
INSERT INTO public."user"(
	id, name, username, password, active)
	VALUES (1, 'Fabrizio Delcompare', 'fabrizio.delcompare', '123', 't');

INSERT INTO public."user"(
	id, name, username, password, active)
	VALUES (2, 'Juan Jose Elgueta', 'juan.elgueta', '123', 't');

INSERT INTO public."user"(
	id, name, username, password, active)
	VALUES (3, 'Gustavo Garcia', 'gustavo.garcia', '123', 't');