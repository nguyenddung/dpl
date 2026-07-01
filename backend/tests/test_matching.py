import uuid
import pytest
from httpx import AsyncClient
from app.ai.feature_builder import FEATURE_DIM, UserFeatureInput, SUBJECT_VOCAB, build_feature_vector, build_matrix
from app.ai.recommender import StudyMatchRecommender, _jaccard, _gpa_prox, _schedule_overlap

def make_user(**kwargs): return UserFeatureInput(user_id=uuid.uuid4(), **kwargs)

def test_feature_vector_shape():
    assert build_feature_vector(UserFeatureInput(user_id=None)).shape == (FEATURE_DIM,)

def test_subject_encoding():
    u = UserFeatureInput(user_id=None, subjects=[SUBJECT_VOCAB[0], SUBJECT_VOCAB[5]])
    v = build_feature_vector(u)
    assert v[0] == 1.0 and v[5] == 1.0

def test_gpa_normalised():
    u = UserFeatureInput(user_id=None, gpa=3.2)
    v = build_feature_vector(u)
    assert abs(v[FEATURE_DIM-1] - 3.2/4.0) < 1e-5

def test_jaccard_identical():
    assert _jaccard({"a","b"}, {"a","b"}) == 1.0

def test_jaccard_disjoint():
    assert _jaccard({"a"}, {"b"}) == 0.0

def test_gpa_prox_identical():
    assert _gpa_prox(3.5, 3.5) == 1.0

def test_gpa_prox_none():
    assert _gpa_prox(None, 3.5) == 0.5

def test_recommender_fit_recommend():
    users = [make_user(subjects=["Python","AI"], gpa=3.5, learning_style="visual"),
             make_user(subjects=["Python","AI"], gpa=3.6, learning_style="visual"),
             make_user(subjects=["Marketing"], gpa=3.0, learning_style="social")]
    rec = StudyMatchRecommender(n_neighbors=3)
    rec.fit(users)
    q = make_user(subjects=["Python","AI"], gpa=3.5, learning_style="visual")
    results = rec.recommend(q, top_k=2, exclude_ids=[q.user_id])
    assert len(results) == 2
    assert results[0].total_score >= results[1].total_score

def test_recommender_empty_before_fit():
    assert StudyMatchRecommender().recommend(make_user()) == []

@pytest.mark.asyncio
async def test_recommendations_endpoint(client: AsyncClient, auth_headers: dict):
    r = await client.get("/api/v1/matching/recommendations", headers=auth_headers)
    assert r.status_code == 200
    assert "results" in r.json()

@pytest.mark.asyncio
async def test_connect_self(client: AsyncClient, auth_headers: dict, test_user):
    r = await client.post(f"/api/v1/matching/connect/{test_user.id}", headers=auth_headers)
    assert r.status_code == 400
    assert r.json()["detail"]["code"] == "SELF_CONNECT"
