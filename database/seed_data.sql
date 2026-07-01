INSERT INTO subjects (name, category) VALUES
('Toán cao cấp','STEM'),('Vật lý đại cương','STEM'),('Lập trình Python','STEM'),
('AI / Machine Learning','STEM'),('Data Science','STEM'),('Mạng máy tính','STEM'),
('Marketing số','Business'),('Kinh tế vi mô','Business'),('Tài chính doanh nghiệp','Business'),
('Kế toán tài chính','Business'),('Tiếng Anh học thuật','Language'),('Tiếng Nhật N3','Language'),
('Thiết kế đồ hoạ','Design'),('UI / UX Design','Design'),('Luật dân sự','Law'),('Y học cơ sở','Health')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, university, major, year_of_study, gpa, is_verified) VALUES
('00000000-0000-0000-0000-000000000001','demo@cocstudy.vn','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgIVHHMlNb.FLSRqMBLmiG','Demo User','ĐH Bách Khoa HN','Công nghệ thông tin',3,3.70,TRUE),
('00000000-0000-0000-0000-000000000002','minhanh@ntu.edu.vn','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgIVHHMlNb.FLSRqMBLmiG','Trần Minh Anh','ĐH Ngoại thương','Kinh tế đối ngoại',3,3.80,TRUE),
('00000000-0000-0000-0000-000000000003','hainam@hust.edu.vn','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgIVHHMlNb.FLSRqMBLmiG','Nguyễn Hải Nam','ĐH Bách Khoa HN','CNTT',4,3.60,TRUE),
('00000000-0000-0000-0000-000000000004','phuonglinh@vaa.edu.vn','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgIVHHMlNb.FLSRqMBLmiG','Lê Phương Linh','ĐH Mỹ thuật CN','Thiết kế đồ hoạ',2,3.75,TRUE),
('00000000-0000-0000-0000-000000000005','tuankiet@neu.edu.vn','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgIVHHMlNb.FLSRqMBLmiG','Phạm Tuấn Kiệt','ĐH Kinh tế QD','Tài chính - Ngân hàng',3,3.50,TRUE),
('00000000-0000-0000-0000-000000000006','thuha@ussh.edu.vn','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgIVHHMlNb.FLSRqMBLmiG','Vũ Thu Hà','ĐH KHXH & NV','Ngôn ngữ Anh',3,3.90,TRUE),
('00000000-0000-0000-0000-000000000007','ducanh@hust.edu.vn','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgIVHHMlNb.FLSRqMBLmiG','Đỗ Đức Anh','ĐH Bách Khoa HN','Điện tử viễn thông',4,3.40,TRUE),
('00000000-0000-0000-0000-000000000008','minhchau@rmit.edu.vn','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgIVHHMlNb.FLSRqMBLmiG','Hoàng Minh Châu','RMIT Vietnam','Business IT',2,3.85,TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, bio, learning_style, academic_goal, availability, xp_points, streak_days) VALUES
('00000000-0000-0000-0000-000000000001','Sinh viên CNTT năm 3, đam mê AI và Data Science.','visual','job_prep','evening',320,7),
('00000000-0000-0000-0000-000000000002','Đang chuẩn bị cho kỳ thi ACCA. Thích học nhóm.','social','certification','evening',540,14),
('00000000-0000-0000-0000-000000000003','Backend developer, muốn tìm partner làm project ML.','kinesthetic','job_prep','evening',280,5),
('00000000-0000-0000-0000-000000000004','Designer đam mê UI/UX, tìm bạn cùng làm portfolio.','visual','job_prep','flexible',190,3),
('00000000-0000-0000-0000-000000000005','Chuẩn bị thi CFA Level 1.','reading','certification','morning',410,10),
('00000000-0000-0000-0000-000000000006','Luyện IELTS 7.5+ để du học Anh.','auditory','study_abroad','afternoon',620,21),
('00000000-0000-0000-0000-000000000007','Nghiên cứu IoT và hệ thống nhúng.','kinesthetic','research','evening',150,2),
('00000000-0000-0000-0000-000000000008','Business IT student, thích startup.','social','startup','flexible',380,8)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO study_groups (id, name, description, icon, owner_id, max_members, is_public) VALUES
('10000000-0000-0000-0000-000000000001','AI & Machine Learning','Học Deep Learning cùng nhau','🤖','00000000-0000-0000-0000-000000000001',6,TRUE),
('10000000-0000-0000-0000-000000000002','Nhóm Marketing số','Học Brand & Content Strategy','💼','00000000-0000-0000-0000-000000000002',8,TRUE),
('10000000-0000-0000-0000-000000000003','Ôn thi cuối kỳ Toán','Toán cao cấp và xác suất','📊','00000000-0000-0000-0000-000000000003',10,TRUE),
('10000000-0000-0000-0000-000000000004','UI/UX Design Club','Thực hành thiết kế giao diện','🎨','00000000-0000-0000-0000-000000000004',8,TRUE),
('10000000-0000-0000-0000-000000000005','Tài chính & Đầu tư','Phân tích thị trường và CFA prep','💰','00000000-0000-0000-0000-000000000005',6,TRUE),
('10000000-0000-0000-0000-000000000006','English Speaking Club','Luyện IELTS Speaking','🌐','00000000-0000-0000-0000-000000000006',12,TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO group_members (group_id, user_id, role) VALUES
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','owner'),
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','member'),
('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','owner'),
('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000003','owner'),
('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000004','owner'),
('10000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000005','owner'),
('10000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000006','owner')
ON CONFLICT DO NOTHING;

INSERT INTO notifications (user_id, type, title, body, is_read) VALUES
('00000000-0000-0000-0000-000000000001','match_request','Trần Minh Anh đã gửi lời mời kết nối',NULL,FALSE),
('00000000-0000-0000-0000-000000000001','achievement','Bạn đã học 7 ngày liên tiếp! +20 XP',NULL,FALSE)
ON CONFLICT DO NOTHING;
