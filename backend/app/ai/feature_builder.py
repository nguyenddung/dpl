from __future__ import annotations
from dataclasses import dataclass, field
from uuid import UUID
import numpy as np

SUBJECT_VOCAB: list[str] = [
    "Toán cao cấp","Vật lý","Hóa học","Sinh học","Lập trình Python","AI / Machine Learning",
    "Data Science","Mạng máy tính","Marketing số","Kinh tế vi mô","Tài chính doanh nghiệp",
    "Kế toán tài chính","Tiếng Anh học thuật","Tiếng Nhật N3","Thiết kế đồ hoạ","UI / UX Design",
    "Luật dân sự","Y học cơ sở","Điện tử","Cơ khí","Xây dựng","Tâm lý học","Báo chí",
    "Truyền thông","Java","C++","JavaScript","SQL","Excel","Thống kê",
    "Xác suất","Vật lý lý thuyết","Hóa hữu cơ","Kiến trúc","Môi trường",
    "Quản trị kinh doanh","Ngôn ngữ Anh","Dịch thuật","Tiếng Hàn","Nhiếp ảnh",
    "IoT","Embedded","Năng lượng tái tạo","Machine Learning","Deep Learning",
    "React","Node.js","Docker","Git","Agile","IELTS",
]
SUBJECT_VOCAB = SUBJECT_VOCAB[:50]

LEARNING_STYLES = ["visual","auditory","reading","kinesthetic","social","solitary"]
ACADEMIC_GOALS = ["exam_prep","certification","job_prep","research","study_abroad","startup"]
DAYS = list(range(7))
TIME_SLOTS = ["7-9h","9-11h","13-15h","15-17h","19-21h","21-23h"]
FEATURE_DIM = len(SUBJECT_VOCAB) + len(DAYS)*len(TIME_SLOTS) + len(LEARNING_STYLES) + len(ACADEMIC_GOALS) + 1

@dataclass
class UserFeatureInput:
    user_id: UUID | None
    subjects: list[str] = field(default_factory=list)
    schedule: list[tuple[int,str]] = field(default_factory=list)
    learning_style: str | None = None
    academic_goal: str | None = None
    gpa: float | None = None

def build_feature_vector(user: UserFeatureInput) -> np.ndarray:
    vec = np.zeros(FEATURE_DIM, dtype=np.float32)
    offset = 0
    for s in user.subjects:
        if s in SUBJECT_VOCAB:
            vec[offset + SUBJECT_VOCAB.index(s)] = 1.0
    offset += len(SUBJECT_VOCAB)
    for day, slot in user.schedule:
        if 0 <= day < 7 and slot in TIME_SLOTS:
            vec[offset + day*len(TIME_SLOTS) + TIME_SLOTS.index(slot)] = 1.0
    offset += len(DAYS)*len(TIME_SLOTS)
    if user.learning_style and user.learning_style in LEARNING_STYLES:
        vec[offset + LEARNING_STYLES.index(user.learning_style)] = 1.0
    offset += len(LEARNING_STYLES)
    if user.academic_goal and user.academic_goal in ACADEMIC_GOALS:
        vec[offset + ACADEMIC_GOALS.index(user.academic_goal)] = 1.0
    offset += len(ACADEMIC_GOALS)
    if user.gpa is not None:
        vec[offset] = float(user.gpa) / 4.0
    return vec

def build_matrix(users: list[UserFeatureInput]) -> tuple[np.ndarray, list[UUID]]:
    matrix = np.vstack([build_feature_vector(u) for u in users]).astype(np.float32)
    return matrix, [u.user_id for u in users]
