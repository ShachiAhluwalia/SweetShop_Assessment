from fastapi import FastAPI

app = FastAPI(title="Sweet Shop API")

@app.get("/")
def root():
    return {"message": "Sweet Shop API is running"}
