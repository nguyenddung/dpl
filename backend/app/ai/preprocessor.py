import numpy as np
from sklearn.preprocessing import StandardScaler

class FeaturePreprocessor:
    def __init__(self):
        self._scaler = StandardScaler(copy=True)
        self._is_fitted = False
    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        X_scaled = self._scaler.fit_transform(X)
        self._is_fitted = True
        return X_scaled.astype(np.float32)
    def transform(self, X: np.ndarray) -> np.ndarray:
        if not self._is_fitted:
            raise RuntimeError("Must call fit_transform first.")
        return self._scaler.transform(X).astype(np.float32)
    @property
    def is_fitted(self): return self._is_fitted
