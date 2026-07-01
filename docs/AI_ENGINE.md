# CócStudy AI Engine

## Feature Vector (105 dims)
[0:50] subjects multi-hot | [50:92] schedule 7×6 binary | [92:98] learning_style one-hot
[98:104] academic_goal one-hot | [104] GPA normalised

## Weights
subjects=0.35, schedule=0.25, learning_style=0.15, academic_goal=0.15, gpa=0.10

## Pipeline
feature_builder → StandardScaler → KNN(cosine, k=20) → weighted rescore → MatchResult

## Files
- app/ai/feature_builder.py — vector construction
- app/ai/preprocessor.py — normalization
- app/ai/recommender.py — KNN + scoring engine
