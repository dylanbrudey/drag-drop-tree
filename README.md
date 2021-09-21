# drag-drop-tree


## Projet

#### Technologies utilisés
* React => frontend
* Django REST Framework => API

#### Décomposition du projet
Le projet est decomposé en plusieurs parties :
* le frontend : qui contient l'application 
* le backend : qui contient l'api

---
## Project setup

Installation à faire pour démarrer le projet

### Get the project

```
git clone https://github.com/dylanbrudey/drag-drop-tree.git
```

### Project setup (Frontend) 

#### Installation
```
yarn install
```

#### Lancer le front
```
yarn start
```

### Project setup (Backend)

#### Installation

##### Création d'un environnement virtuel

###### Windows
```
python -m venv ./api/venv
```
###### Unix
```
python3 -m venv ./api/venv
```
##### Lancement de l'environnement virtuel

###### Windows
```
.\api\venv\Scripts\activate
```
###### Unix
```
source api/venv/bin/activate
```
##### Installation des dépendances
###### Windows
```
pip install .\api\requirements.txt
```
###### Unix
```
pip3 install ./api/requirements.txt
```

#### Lancement de l'api
```
python manager.py runserver
```
