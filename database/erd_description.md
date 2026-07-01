# CócStudy ERD

users ─1:1─ profiles
users ─1:N─ user_subjects ─N:1─ subjects
users ─1:N─ schedules
users ─M:N(self)─ matches
users ─M:N─ group_members ─N:1─ study_groups
users ─M:N(self)─ conversations ─1:N─ messages
users ─1:N─ notifications
users ─M:N─ feedback ─N:1─ matches

12 tables total, all UUID PKs, all FK indexed.
