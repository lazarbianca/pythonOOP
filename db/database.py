import sqlite3
from datetime import datetime
import uuid
import logging

DB_PATH = "jobs.db"


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            job_id TEXT PRIMARY KEY,
            operation TEXT,
            input_data TEXT,
            result TEXT,
            status TEXT,
            created_at TEXT
        )
        """)
        conn.commit()


def create_job(operation: str, input_data: str) -> str:
    job_id = str(uuid.uuid4())
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "INSERT INTO jobs (job_id, operation, input_data, \
            result, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (job_id, operation, input_data, None,
             "pending", datetime.utcnow().isoformat())
        )
        conn.commit()
    return job_id


def update_job(job_id: str, result):
    logging.info("update_job %s (result ready)", job_id) 
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "UPDATE jobs SET result=?, status='done' WHERE job_id=?",
            (str(result), job_id)
        )
        conn.commit()


def get_job(job_id: str) -> dict:
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.execute(
            "SELECT job_id, status, result \
            FROM jobs WHERE job_id = ?", (job_id,))
        row = cur.fetchone()
        if row:
            return {"job_id": row[0], "status": row[1], "result": row[2]}
        return {"status": "not_found", "result": None}
