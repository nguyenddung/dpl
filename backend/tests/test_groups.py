import pytest
from httpx import AsyncClient
from app.core.security import create_access_token

URL = "/api/v1/groups"

async def make_group(client, headers, name="Test Group"):
    r = await client.post(URL, json={"name": name, "description": "Test", "max_members": 5}, headers=headers)
    assert r.status_code == 201
    return r.json()

@pytest.mark.asyncio
async def test_create_group(client: AsyncClient, auth_headers: dict):
    r = await client.post(URL, json={"name": "AI Group", "max_members": 8}, headers=auth_headers)
    assert r.status_code == 201
    assert r.json()["member_count"] == 1

@pytest.mark.asyncio
async def test_list_groups(client: AsyncClient, auth_headers: dict):
    await make_group(client, auth_headers, "Alpha")
    await make_group(client, auth_headers, "Beta")
    r = await client.get(URL, headers=auth_headers)
    assert r.status_code == 200
    assert len(r.json()) >= 2

@pytest.mark.asyncio
async def test_join_group(client: AsyncClient, auth_headers: dict, second_user):
    g = await make_group(client, auth_headers)
    h2 = {"Authorization": f"Bearer {create_access_token(second_user.id)}"}
    r = await client.post(f"{URL}/{g['id']}/join", headers=h2)
    assert r.status_code == 201
    assert r.json()["role"] == "member"

@pytest.mark.asyncio
async def test_join_twice_409(client: AsyncClient, auth_headers: dict, second_user):
    g = await make_group(client, auth_headers)
    h2 = {"Authorization": f"Bearer {create_access_token(second_user.id)}"}
    await client.post(f"{URL}/{g['id']}/join", headers=h2)
    r = await client.post(f"{URL}/{g['id']}/join", headers=h2)
    assert r.status_code == 409

@pytest.mark.asyncio
async def test_owner_cannot_leave(client: AsyncClient, auth_headers: dict):
    g = await make_group(client, auth_headers)
    r = await client.delete(f"{URL}/{g['id']}/leave", headers=auth_headers)
    assert r.status_code == 400
    assert r.json()["detail"]["code"] == "OWNER_CANNOT_LEAVE"

@pytest.mark.asyncio
async def test_list_members(client: AsyncClient, auth_headers: dict, second_user):
    g = await make_group(client, auth_headers)
    h2 = {"Authorization": f"Bearer {create_access_token(second_user.id)}"}
    await client.post(f"{URL}/{g['id']}/join", headers=h2)
    r = await client.get(f"{URL}/{g['id']}/members", headers=auth_headers)
    assert r.status_code == 200
    assert len(r.json()) == 2
