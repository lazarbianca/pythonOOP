 # 🧮 Math Worker — FastAPI × React (Vite)

End-to-end demo:

| Layer        | Tech            | Rol                                                         |
|--------------|-----------------|-------------------------------------------------------------|
| **Backend**  | FastAPI + SQLite| Expune operații matematice (putere, factorial, fibonacci) ca job-uri rulate pe thread-uri; rezultatele se salvează în DB și se pot consulta prin polling |
| **Frontend** | React (Vite)    | UI minimal care trimite cereri și afișează rezultatele în timp real |
| **Caching**  | `functools.lru_cache` | Răspunde instant pentru calcule repetate |
| **Container**| Docker          | Imagine unică pentru backend; front-end rulează în dev cu Vite |

---

## 📂 Structura proiectului

pythonOOP/
├─ main.py
├─ controllers/
│  └─ math_controller.py
├─ db/
│  └─ database.py
├─ math-ui/
│  ├─ node_modules/        (ignored)
│  ├─ public/
│  └─ src/
│     ├─ assets/
│     ├─ App.jsx
│     ├─ App.css
│     ├─ MathWorkerUI.jsx
│     └─ ...
├─ models/
│  └─ request_models.py
├─ services/
│  └─ math_service.py
├─ utils/
│  ├─ cache.py
│  └─ logger.py
├─ venv/                   (ignored)
├─ Dockerfile
├─ jobs.db                 (ignored)
├─ requirements.txt
└─ .gitignore


---

## ⚙️ Pornire rapidă (dev)

### Backend

```bash
docker build -t pythonoop .
docker run -d -p 8000:8000 --name pythonoop pythonoop
# Swagger: http://localhost:8000/docs

### Frontend
cd math-ui
npm install
npm run dev
# UI: http://localhost:5173

### Caching and big-int fix
# main.py  (executat înainte de job-uri)
import sys
sys.set_int_max_str_digits(1_000_000)  # permite rezultate cu până la 1 milion de cifre

@lru_cache(maxsize=1024)
def factorial_task(n: int):
    ...

### Comenzi utile
# log live (include timpi de execuție)
docker logs -f pythonoop

# oprire & ștergere container
docker stop pythonoop && docker rm pythonoop
