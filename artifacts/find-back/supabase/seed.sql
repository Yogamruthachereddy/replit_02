-- Fictional, repeatable demonstration cases and sightings.
-- Does not create Auth users, set privileged roles, or contain real case information.

insert into public.missing_persons (
  id, full_name, age, gender, height, identifying_marks, hair_description,
  eye_description, clothing_description, last_seen_date, last_seen_time,
  public_area, city, district, state, public_latitude, public_longitude,
  public_circumstances, status, verified_at
) values
('10000000-0000-4000-8000-000000000001','Aarav Reddy',16,'Male','5 ft 6 in','Small birthmark near left wrist','Dark, short','Brown','Navy school jacket, light trousers',current_date - 1,'16:30','Central Kadapa','Kadapa','YSR Kadapa','Andhra Pradesh',14.47,78.82,'Last seen leaving a public transit stop. Family has notified local authorities.','active',now()),
('10000000-0000-4000-8000-000000000002','Meera Nair',28,'Female','5 ft 3 in','None reported','Dark, shoulder length','Brown','Green kurta and black trousers',current_date - 2,'19:10','North Bengaluru','Bengaluru','Bengaluru Urban','Karnataka',13.04,77.59,'Last seen near a busy shopping area.','under_investigation',now()),
('10000000-0000-4000-8000-000000000003','Kabir Das',41,'Male','5 ft 9 in','Glasses','Salt-and-pepper','Brown','Grey collared shirt and dark trousers',current_date - 3,'08:45','Alipore, Kolkata','Kolkata','Kolkata','West Bengal',22.53,88.33,'Did not return from a morning walk. Family has filed a report.','possible_sighting',now()),
('10000000-0000-4000-8000-000000000004','Ishita Rao',19,'Female','5 ft 4 in','Small silver nose stud','Dark, tied back','Brown','White top and denim backpack',current_date - 4,'14:00','Central Hyderabad','Hyderabad','Hyderabad','Telangana',17.39,78.48,'Last seen leaving campus.','verified',now()),
('10000000-0000-4000-8000-000000000005','Dev Patel',34,'Male','5 ft 8 in','Steel wristwatch','Dark, wavy','Brown','Blue checked shirt',current_date - 5,'20:15','Powai, Mumbai','Mumbai','Mumbai Suburban','Maharashtra',19.12,72.91,'Was expected home after meeting friends nearby.','active',now()),
('10000000-0000-4000-8000-000000000006','Nandini Joseph',67,'Female','5 ft 1 in','Uses a walking stick','Grey, short','Brown','Maroon shawl over cream sari',current_date - 6,'11:20','Fort Kochi, Kochi','Kochi','Ernakulam','Kerala',9.97,76.24,'May need assistance navigating unfamiliar areas.','under_investigation',now()),
('10000000-0000-4000-8000-000000000007','Sana Khan',25,'Female','5 ft 5 in','None reported','Dark, long','Brown','Blue salwar suit with a light scarf',current_date - 7,'17:40','North Jaipur','Jaipur','Jaipur','Rajasthan',26.94,75.79,'Last seen walking toward a nearby transit stop.','possible_sighting',now()),
('10000000-0000-4000-8000-000000000008','Rohan Sen',12,'Male','4 ft 11 in','Red thread bracelet','Dark, straight','Brown','Yellow T-shirt and charcoal shorts',current_date - 8,'15:05','Salt Lake, Kolkata','Kolkata','North 24 Parganas','West Bengal',22.58,88.42,'Last seen after a neighborhood sports activity.','found',now()),
('10000000-0000-4000-8000-000000000009','Leela Menon',52,'Female','5 ft 2 in','Round-frame glasses','Dark with grey streaks','Brown','Light blue sari and brown sandals',current_date - 9,'09:30','Mylapore, Chennai','Chennai','Chennai','Tamil Nadu',13.03,80.27,'Did not arrive at an expected appointment.','closed',now()),
('10000000-0000-4000-8000-000000000010','Vikram Gill',30,'Male','5 ft 10 in','Small tattoo on right forearm','Dark, short','Brown','Black hoodie, olive backpack',current_date - 10,'21:00','Old Delhi','Delhi','Central Delhi','Delhi',28.65,77.22,'Expected to travel to a nearby city but did not arrive.','pending_verification',null),
('10000000-0000-4000-8000-000000000011','Tara Bose',22,'Female','5 ft 6 in','None reported','Dark, shoulder length','Brown','Beige jacket and dark jeans',current_date - 11,'18:15','Indiranagar, Bengaluru','Bengaluru','Bengaluru Urban','Karnataka',12.98,77.64,'Last seen in a public area after work.','active',now()),
('10000000-0000-4000-8000-000000000012','Aditya Kulkarni',73,'Male','5 ft 7 in','Prescription glasses','Grey, thinning','Brown','White kurta and tan sandals',current_date - 12,'07:50','Shivajinagar, Pune','Pune','Pune','Maharashtra',18.53,73.85,'May be disoriented and benefit from calm assistance.','verified',now()),
('10000000-0000-4000-8000-000000000013','Farah Ali',38,'Female','5 ft 3 in','Small scar near chin','Dark, covered with a scarf','Brown','Lavender kurta with cream scarf',current_date - 13,'13:10','Banjara Hills, Hyderabad','Hyderabad','Hyderabad','Telangana',17.42,78.44,'Last seen near a public transport hub.','under_investigation',now()),
('10000000-0000-4000-8000-000000000014','Manav Shah',15,'Male','5 ft 4 in','Blue sports bag','Dark, short','Brown','Red sports jersey and black shorts',current_date - 14,'17:25','Satellite, Ahmedabad','Ahmedabad','Ahmedabad','Gujarat',23.03,72.51,'Did not return after an evening practice.','possible_sighting',now()),
('10000000-0000-4000-8000-000000000015','Ananya Das',47,'Female','5 ft 2 in','Gold-rimmed glasses','Dark, tied back','Brown','Rust-colored shawl and dark trousers',current_date - 15,'10:40','Bhopal Lakefront','Bhopal','Bhopal','Madhya Pradesh',23.25,77.40,'Last seen during a regular morning walk.','closed',now())
on conflict (id) do update set
  full_name = excluded.full_name,
  age = excluded.age,
  gender = excluded.gender,
  clothing_description = excluded.clothing_description,
  last_seen_date = excluded.last_seen_date,
  public_area = excluded.public_area,
  city = excluded.city,
  state = excluded.state,
  status = excluded.status,
  verified_at = excluded.verified_at;

insert into public.sightings (
  id, case_id, anonymous, sighting_date, sighting_time, public_location,
  public_latitude, public_longitude, description, status
) values
('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',false,current_date,'09:15','Kadapa central market',14.47,78.82,'A person matching the public description was seen near the market entrance. No contact was made.','pending_review'),
('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',true,current_date - 1,'20:10','North Bengaluru transit area',13.04,77.59,'Possible match seen waiting near a public transport stop.','verified'),
('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000003',false,current_date - 2,'08:50','Kolkata riverside path',22.53,88.33,'A person with similar clothing was seen walking east. The observer did not approach.','pending_review'),
('20000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000005',true,current_date - 4,'21:20','Powai public promenade',19.12,72.91,'A possible sighting was shared with the review team.','needs_more_information'),
('20000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000006',false,current_date - 5,'11:30','Kochi community clinic',9.97,76.24,'A person matching the description was seen near the clinic reception.','verified'),
('20000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000007',true,current_date - 6,'18:05','Jaipur north garden',26.94,75.79,'Possible match near a garden gate at the stated time.','pending_review'),
('20000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000008',false,current_date - 7,'15:30','Salt Lake sports ground',22.58,88.42,'Information was submitted before the case was updated.','verified'),
('20000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000011',true,current_date - 9,'18:40','Indiranagar public street',12.98,77.64,'A person matching the clothing description was seen from a distance.','rejected'),
('20000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000012',false,current_date - 10,'08:10','Pune market area',18.53,73.85,'A possible match was seen near the market. Reviewer requested a time confirmation.','needs_more_information'),
('20000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000014',true,current_date - 12,'17:45','Ahmedabad sports complex',23.03,72.51,'A person carrying a similar sports bag was noticed near the entrance.','pending_review')
on conflict (id) do update set
  status = excluded.status,
  description = excluded.description,
  public_location = excluded.public_location;

insert into public.case_updates (id, case_id, author_name, type, message, visibility)
select ('30000000-0000-4000-8000-' || lpad(n::text,12,'0'))::uuid, m.id, 'FindBack demo',
  'report_submitted', 'Fictional demonstration report submitted for authorized review.', 'public'
from generate_series(1,15) n
join public.missing_persons m on m.id = ('10000000-0000-4000-8000-' || lpad(n::text,12,'0'))::uuid
on conflict (id) do nothing;
