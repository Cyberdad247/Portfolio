
from fastapi import FastAPI

app = FastAPI(title="Invisioned Marketing API")

@app.get("/")
def root():
    return {"status":"ok"}

@app.get("/api/v1/agents")
def agents():
    return {
        "items":[
            {"id":"seo-agent","name":"SEO Agent"},
            {"id":"content-agent","name":"Content Agent"},
            {"id":"social-agent","name":"Social Agent"}
        ]
    }
