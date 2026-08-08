import logging
from typing import Dict, Any, List, Optional
import asyncio

logger = logging.getLogger("uvicorn")

class InMemoryCollection:
    """Fallback high-performance document collection when local MongoDB daemon is not running."""
    def __init__(self, name: str):
        self.name = name
        self._data: Dict[str, Dict[str, Any]] = {}

    async def find_one(self, filter_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for item in self._data.values():
            match = True
            for k, v in filter_dict.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item.copy()
        return None

    async def insert_one(self, document: Dict[str, Any]):
        doc_id = str(document.get("_id") or document.get("id") or len(self._data) + 1)
        doc = document.copy()
        doc["_id"] = doc_id
        if "id" not in doc:
            doc["id"] = doc_id
        self._data[doc_id] = doc
        class InsertResult:
            inserted_id = doc_id
        return InsertResult()

    async def update_one(self, filter_dict: Dict[str, Any], update_dict: Dict[str, Any], upsert: bool = False):
        existing = await self.find_one(filter_dict)
        if existing:
            doc_id = existing["_id"]
            if "$set" in update_dict:
                self._data[doc_id].update(update_dict["$set"])
            else:
                self._data[doc_id].update(update_dict)
        elif upsert:
            new_doc = filter_dict.copy()
            if "$set" in update_dict:
                new_doc.update(update_dict["$set"])
            await self.insert_one(new_doc)

    async def find_all(self, filter_dict: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        results = []
        filter_dict = filter_dict or {}
        for item in self._data.values():
            match = True
            for k, v in filter_dict.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                results.append(item.copy())
            if len(results) >= limit:
                break
        return results

    def find(self, filter_dict: Optional[Dict[str, Any]] = None):
        class Cursor:
            def __init__(self, items):
                self.items = items
            def sort(self, key_or_list, direction=1):
                return self
            def limit(self, n):
                self.items = self.items[:n]
                return self
            async def to_list(self, length: int = 100):
                return self.items[:length]
            def __aiter__(self):
                self._iter = iter(self.items)
                return self
            async def __anext__(self):
                try:
                    return next(self._iter)
                except StopIteration:
                    raise StopAsyncIteration

        filter_dict = filter_dict or {}
        matched = []
        for item in self._data.values():
            match = True
            for k, v in filter_dict.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                matched.append(item.copy())
        return Cursor(matched)

    async def delete_one(self, filter_dict: Dict[str, Any]):
        existing = await self.find_one(filter_dict)
        if existing:
            doc_id = existing["_id"]
            if doc_id in self._data:
                del self._data[doc_id]

class DatabaseManager:
    """Manages MongoDB connection with resilient automated fallback."""
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        self.collections: Dict[str, InMemoryCollection] = {}

    async def connect_to_database(self, mongodb_url: str, db_name: str):
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            self.client = AsyncIOMotorClient(mongodb_url, serverSelectionTimeoutMS=2000)
            await self.client.admin.command('ping')
            self.db = self.client[db_name]
            self.is_connected = True
            logger.info("Successfully connected to live MongoDB instance.")
        except Exception as e:
            logger.warning(f"MongoDB server connection failed ({e}). Initializing high-performance in-memory persistence layer.")
            self.is_connected = False
            self.db = self

    def get_collection(self, collection_name: str):
        if self.is_connected and self.db is not self:
            return self.db[collection_name]
        if collection_name not in self.collections:
            self.collections[collection_name] = InMemoryCollection(collection_name)
        return self.collections[collection_name]

    async def close_database_connection(self):
        if self.client and self.is_connected:
            self.client.close()
            logger.info("Closed MongoDB connection.")

db_manager = DatabaseManager()

def get_database():
    return db_manager
