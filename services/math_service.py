from concurrent.futures import ThreadPoolExecutor
from db.database import update_job
from functools import lru_cache 
import time, logging

executor = ThreadPoolExecutor(max_workers=4)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

def pow_task(a: float, b: float) -> float:
    return a ** b

@lru_cache(maxsize=1024)    
def factorial_task(n: int) -> int:
    start = time.perf_counter()
    result = 1
    for i in range(2, n + 1):
        result *= i
    elapsed = (time.perf_counter() - start) * 1_000 
    logging.info("factorial(%s) finished in %.0f ms", n, elapsed)
    return result

@lru_cache(maxsize=1024)
def fibonacci_task(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def submit_task(func, job_id, *args):
    def wrapper():
        try:
            result = func(*args)
            update_job(job_id, result)     
        except Exception as e:
            logging.exception("Worker failed for %s", job_id)
    executor.submit(wrapper)

