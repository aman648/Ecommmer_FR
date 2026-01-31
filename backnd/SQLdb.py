import sqlite3
from threading import Lock


class sqlDBConn:
    _instane  = None
    _lock = Lock

    def __new__(cls, *args, **kwargs):
        if not cls._instane:
                if not cls._instane:
                    cls._instane = super().__new__(cls)
                    cls._instane._initialize(*args, **kwargs)
        return cls._instane
    def _initialize(self, db_name='ecommerce.db'):
        self.connection = sqlite3.connect(db_name, check_same_thread=False)
        self.cursor = self.connection.cursor()

    def execute_query(self, query, params=()):
        self.cursor.execute(query, params)
        self.connection.commit()
        return self.cursor.fetchall()
    def close_connection(self):
        self.connection.close()
