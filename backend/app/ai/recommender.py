from __future__ import annotations
import logging
from dataclasses import dataclass
from uuid import UUID
import numpy as np
from sklearn.neighbors import NearestNeighbors
from app.ai.feature_builder import UserFeatureInput, build_feature_vector, build_matrix
from app.ai.preprocessor import FeaturePreprocessor

logger = logging.getLogger(__name__)

WEIGHTS = {"subjects": 0.35, "schedule": 0.25, "learning_style": 0.15, "academic_goal": 0.15, "gpa": 0.10}
KNN_NEIGHBORS = 20

@dataclass
class MatchScore:
    candidate_id: UUID
    total_score: float
    subject_score: float
    schedule_score: float
    style_score: float
    goal_score: float
    gpa_score: float

class StudyMatchRecommender:
    def __init__(self, n_neighbors: int = KNN_NEIGHBORS):
        self._n_neighbors = n_neighbors
        self._preprocessor = FeaturePreprocessor()
        self._knn: NearestNeighbors | None = None
        self._index_ids: list[UUID] = []
        self._raw_inputs: dict[UUID, UserFeatureInput] = {}

    def fit(self, users: list[UserFeatureInput]) -> None:
        if len(users) < 2:
            return
        matrix, ids = build_matrix(users)
        X_norm = self._preprocessor.fit_transform(matrix)
        n = min(self._n_neighbors, len(users))
        self._knn = NearestNeighbors(n_neighbors=n, metric="cosine", algorithm="brute")
        self._knn.fit(X_norm)
        self._index_ids = ids
        self._raw_inputs = {u.user_id: u for u in users}
        logger.info("Recommender index built: %d users", len(users))

    def recommend(self, query: UserFeatureInput, top_k: int = 10, exclude_ids: list[UUID] | None = None) -> list[MatchScore]:
        if self._knn is None:
            return []
        q_vec = build_feature_vector(query).reshape(1, -1)
        q_norm = self._preprocessor.transform(q_vec)
        distances, indices = self._knn.kneighbors(q_norm)
        exclude = set(exclude_ids or [])
        exclude.add(query.user_id)
        results = []
        for idx in indices[0]:
            cid = self._index_ids[idx]
            if cid in exclude:
                continue
            candidate = self._raw_inputs.get(cid)
            if candidate:
                results.append(self._score(query, candidate))
        results.sort(key=lambda r: r.total_score, reverse=True)
        return results[:top_k]

    def score_pair(self, a: UserFeatureInput, b: UserFeatureInput) -> MatchScore:
        return self._score(a, b)

    def _score(self, a: UserFeatureInput, b: UserFeatureInput) -> MatchScore:
        s_subj = _jaccard(set(a.subjects), set(b.subjects))
        s_sched = _schedule_overlap(a.schedule, b.schedule)
        s_style = _exact(a.learning_style, b.learning_style)
        s_goal = _exact(a.academic_goal, b.academic_goal)
        s_gpa = _gpa_prox(a.gpa, b.gpa)
        total = (WEIGHTS["subjects"]*s_subj + WEIGHTS["schedule"]*s_sched +
                 WEIGHTS["learning_style"]*s_style + WEIGHTS["academic_goal"]*s_goal + WEIGHTS["gpa"]*s_gpa)
        return MatchScore(candidate_id=b.user_id, total_score=round(total*100,2),
            subject_score=round(s_subj*100,2), schedule_score=round(s_sched*100,2),
            style_score=round(s_style*100,2), goal_score=round(s_goal*100,2), gpa_score=round(s_gpa*100,2))

def _jaccard(a: set, b: set) -> float:
    if not a and not b: return 0.5
    u = a | b
    return len(a & b) / len(u) if u else 0.0

def _schedule_overlap(a: list, b: list) -> float:
    sa, sb = set(a), set(b)
    if not sa or not sb: return 0.5
    return len(sa & sb) / len(sa)

def _exact(a, b) -> float:
    if a is None or b is None: return 0.5
    return 1.0 if a == b else 0.0

def _gpa_prox(a, b) -> float:
    if a is None or b is None: return 0.5
    return 1.0 - (abs(a-b)/4.0)

recommender = StudyMatchRecommender()
