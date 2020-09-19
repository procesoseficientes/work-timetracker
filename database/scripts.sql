alter table "user"
	add role_id integer default 1 not null;

alter table "user"
	add constraint role_fk
		foreign key (role_id) references role;
