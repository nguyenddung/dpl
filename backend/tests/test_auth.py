import pytest
from httpx import AsyncClient

REGISTER_URL = "/api/v1/auth/register"
LOGIN_URL = "/api/v1/auth/login"
REFRESH_URL = "/api/v1/auth/refresh"
ME_URL = "/api/v1/auth/me"

VALID = {"email":"student@hust.edu.vn","password":"secure1234","full_name":"Nguyễn An","university":"ĐH Bách Khoa","major":"CNTT"}

@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    r = await client.post(REGISTER_URL, json=VALID)
    assert r.status_code == 201
    assert "access_token" in r.json()

@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    await client.post(REGISTER_URL, json=VALID)
    r = await client.post(REGISTER_URL, json=VALID)
    assert r.status_code == 409
    assert r.json()["detail"]["code"] == "EMAIL_EXISTS"

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    await client.post(REGISTER_URL, json=VALID)
    r = await client.post(LOGIN_URL, json={"email": VALID["email"], "password": VALID["password"]})
    assert r.status_code == 200
    assert "access_token" in r.json()

@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post(REGISTER_URL, json=VALID)
    r = await client.post(LOGIN_URL, json={"email": VALID["email"], "password": "wrong"})
    assert r.status_code == 401

@pytest.mark.asyncio
async def test_get_me(client: AsyncClient, auth_headers: dict):
    r = await client.get(ME_URL, headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == "test@cocstudy.vn"

@pytest.mark.asyncio
async def test_get_me_unauthenticated(client: AsyncClient):
    r = await client.get(ME_URL)
    assert r.status_code == 403

@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient):
    reg = await client.post(REGISTER_URL, json=VALID)
    r = await client.post(REFRESH_URL, json={"refresh_token": reg.json()["refresh_token"]})
    assert r.status_code == 200
    assert "access_token" in r.json()
