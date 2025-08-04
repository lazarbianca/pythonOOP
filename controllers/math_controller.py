from fastapi import APIRouter

from models.request_models import (
    PowRequest, FactorialRequest, FibonacciRequest, JobResponse
)
from db.database import create_job, get_job
from services.math_service import (
    pow_task, factorial_task, fibonacci_task, submit_task
)

router = APIRouter()


@router.post("/pow", response_model=JobResponse)
def calculate_pow(payload: PowRequest):
    job_id = create_job("pow", str(payload.model_dump()))
    submit_task(pow_task, job_id, payload.base, payload.exponent)
    return JobResponse(job_id=job_id, status="pending")


@router.post("/factorial", response_model=JobResponse)
def calculate_factorial(payload: FactorialRequest):
    job_id = create_job("factorial", str(payload.model_dump()))
    submit_task(factorial_task, job_id, payload.number)
    return JobResponse(job_id=job_id, status="pending")


@router.post("/fibonacci", response_model=JobResponse)
def calculate_fibonacci(payload: FibonacciRequest):
    job_id = create_job("fibonacci", str(payload.model_dump()))
    submit_task(fibonacci_task, job_id, payload.number)
    return JobResponse(job_id=job_id, status="pending")


@router.get("/job/{job_id}", response_model=JobResponse)
def get_result(job_id: str):
    job = get_job(job_id)
    return JobResponse(job_id=job_id, status=job["status"],
                       result=job["result"])
