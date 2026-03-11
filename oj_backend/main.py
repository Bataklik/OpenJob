""" Main file for the backend. """
from typing import Annotated
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils import process_match
from schemas import MatchResponse

app = FastAPI(title="OpenJob", description="AI-Powered Job Matching Tool")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# * --- Endpoints ---


@app.post("/match", response_model=MatchResponse)
async def match_job_to_cv(vacancy_text: Annotated[str, Form()],
                          cv_file: Annotated[UploadFile, File()]):
    """Compare a CV with a job description and return a JSON response
    with the match percentage, matched skills, missing skills, and motivation letter.

    Args:
        vacancy_text (Annotated[str, Form): The vacancy description text.
        cv_file (Annotated[UploadFile, File): The CV file.

    Returns:
        dict: A dictionary containing the match percentage,
        matched skills, missing skills, and motivation letter.
    """
    try:
        result = await process_match(vacancy_text, cv_file)
        if "error" in result:
            raise HTTPException(status_code=422, detail=result["error"])
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error") from e
