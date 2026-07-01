from uuid import UUID
from fastapi import HTTPException, status

def validate_gpa(gpa) -> None:
    if gpa is not None and not (0.0 <= gpa <= 4.0):
        raise HTTPException(status_code=422, detail={"code": "INVALID_GPA", "message": "GPA must be 0.0–4.0"})

def validate_year_of_study(year) -> None:
    if year is not None and not (1 <= year <= 6):
        raise HTTPException(status_code=422, detail={"code": "INVALID_YEAR", "message": "Year must be 1–6"})

def validate_uuid_str(value: str, field_name: str = "id") -> UUID:
    try:
        return UUID(value)
    except (ValueError, AttributeError):
        raise HTTPException(status_code=422, detail={"code": "INVALID_UUID", "message": f"'{field_name}' must be a valid UUID"})
