# DjangoVue

Template for fullstack webapp with a `Django Restframwork` backend (hosted on e.g. `PythonAnywhere`) and a `Vue3` frontend (hosted on e.g. `GitHub Pages`, `Netlify`, etc) with some standard features including:

* code formatting `eslint`
* styling: `sass`
* storage: `pinia`
* authentication: `simplejwt`
* development: `vscode`

# Backend

Install `python3.9` (on `Ubuntu 22.04 LTS`) because as of right now that is the latest version supported by `PythonAnywhere`.

```bash
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo add-apt-repository ppa:deadsnakes/ppa
$ sudo apt install python3.9 python3.9-venv
```

Create a venv and install the requirements

```bash
$ cd backend
$ python3.9 -m venv venv
$ source venv/bin/activate
$ pip install --upgrade pip
$ pip install -r requirements.txt
```

Create and fill in `.env` file after obtaining `ip` with `hostname -I`

```env
DEBUG=True
HOST=<ip>
PORT=8000
CORS_ALLOWED_ORIGIN=http://<ip>:3000
SECRET_KEY=supersecretkey
TOKEN_EXPIRATION=1800
REFRESH_TOKEN_EXPIRATION=604800
```

Create the Django Database and a user and runserver

```bash
$ python manage.py makemigrations api
$ python manage.py migrate 
$ python manage.py createsuperuser
$ python manage.py runserver <ip>:8000
```


# Frontend

Install `NodeJs` and `npm` (on `Ubuntu 22.04 LTS`).

```bash
$ cd frontend
$ sudo apt update
$ sudo apt install nodejs
$ sudo apt install npm
```

Create and fill in `.env` file after obtaining `ip` with `hostname -I`

```env
VITE_API_BASE_URL=http://<ip>:8000/api/
```

Install packages and run

```bash
$ npm install
$ npm run dev
```


# Development

Add to `.vscode/tasks.json` after obtaining `ip` with `hostname -I` and start dev with `CTRL+SHIFT+B`

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "backend",
            "type": "shell",
            "command": "cd backend && source venv/bin/activate && python manage.py runserver <ip>:8000",
            "group": "none"
        },
        {
            "label": "frontend",
            "type": "shell",
            "command": "cd frontend && npm run dev",
            "group": "none"
        },
        {
            "label": "run",
            "type": "shell",
            "dependsOn": [
                "backend",
                "frontend"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "problemMatcher": [],
            "presentation": {
                "reveal": "silent",
                "echo": true
            }
        }
    ]
}
```
