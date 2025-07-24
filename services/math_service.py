from concurrent.futures import ThreadPoolExecutor
from db.database import update_job

executor = ThreadPoolExecutor(max_workers=4)


def pow_task(a: float, b: float) -> float:
    return a ** b


def factorial_task(n: int) -> int:
    result = 1
    for i in range(2, n+1):
        result *= i
    return result


def fibonacci_task(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def submit_task(func, job_id: str, *args):
    def task_wrapper():
        result = func(*args)
        update_job(job_id, result)
    executor.submit(task_wrapper)
