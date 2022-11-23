INSERT INTO employee(first_name, last_name, role_id, title)
VALUES ("Adrienne", "Cordell", 1, "Full-Stack-Developer"),
       ("Owen", "Campbell", 2, "Quality-Manager"),
       ("Jayden", "Benedict", 3, "Database-administrator"),
       ("Elizabeth", "Ketola", 4, "Computer-systems-analyst"),
       ("Alayna", "Witsman", 5, "Lead-Developer"),
       ("Jared", "white", 6, "Computer-systems-engineer");

INSERT INTO roles(title, salary, department_id)
VALUES ("Software-Engineer", 150000, 1),
       ("Full-Stack-Developer", 100000, 4),
       ("Quality-Manager", 75000, 2),
       ("Lead-Developer", 175000, 4),
       ("Database-administrator", 85000, 2),
       ("Computer-systems-analyst", 90000, 3),
       ('Computer-systems-engineer', 110000, 1);


INSERT INTO department(department_name)
VALUES ("Develop"),
       ("Engineering"),
       ("Administrate"),
       ("Data");


