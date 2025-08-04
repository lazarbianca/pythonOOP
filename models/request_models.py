from pydantic import BaseModel, Field
from typing import Optional

class PowRequest(BaseModel):
    base: float
    exponent: float


class FactorialRequest(BaseModel):
    number: int = Field(..., ge=0)


class FibonacciRequest(BaseModel):
    number: int = Field(..., ge=0)


class JobResponse(BaseModel):
    job_id: str
    status: str
    result: Optional[str] = None 