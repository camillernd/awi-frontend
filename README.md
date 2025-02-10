# Ah Oui - Application de Gestion de Dépôt-Vente de Jeux de Société

Ah Oui est une application web complète pour la gestion des systèmes de dépôt-vente de jeux de société. Elle est destinée à simplifier les interactions entre vendeurs, acheteurs, et administrateurs lors d'événements tels que des festivals de jeux. Cette application couvre la gestion des stocks, des transactions financières et des bilans tout en garantissant une ergonomie optimale.

## Fonctionnalités Clés

### 1. Gestion des Sessions
- **Création de Sessions** : Les administrateurs peuvent créer des sessions de dépôt-vente correspondant à des périodes de vente définies.
- **Consultation des Sessions** : Liste des sessions actives et passées avec détails (date, lieu, statut).

### 2. Dépôt et Catalogue de Jeux
- **Déposer des Jeux** : Les vendeurs enregistrent plusieurs jeux en une fois. Chaque jeu reçoit une étiquette unique pour le suivi.
- **Catalogue des Jeux** : Les acheteurs consultent les jeux disponibles et filtrent par nom, éditeur ou prix.

### 3. Transactions
- **Enregistrement des Transactions** : Gestion complète des ventes avec mise à jour des stocks et crédit des vendeurs.
- **Encaissement** : Permet aux gestionnaires de scanner les articles, finaliser les paiements et gérer les paniers.
- **Consultation des Transactions** : Vue détaillée avec recherche par client, vendeur ou session.

### 4. Gestion des Stocks
- **Vue des Stocks** : Suivi des jeux en stock ou vendus par vendeur.
- **Récupération des Invendus** : Interface pour les vendeurs afin de récupérer leurs invendus.

### 5. Rôles et Utilisateurs
- **Clients** : Création et gestion des clients avec nom, email, téléphone et adresse.
- **Vendeurs** : Gestion des vendeurs, suivi des gains et jeux associés.
- **Managers** : Gestion des comptes utilisateurs, frais, et commissions.

### 6. Tableau de Bord Financier
- **Bilan Global** : Inclut trésorerie totale, sommes dues aux vendeurs, frais de dépôt et commissions.
- **Bilan Particulier** : Vue personnalisée pour chaque vendeur avec leurs gains et transactions.

### 7. Sécurité et Robustesse
- Gestion des erreurs (dépôt hors session active, erreurs de paiement, etc.).
- Validation stricte des données pour garantir fiabilité et cohérence.

## Structure de la Navbar

La barre de navigation contient les éléments suivants :

1. **Sessions** : Accès à la liste des sessions en cours et passées.
2. **+ Session** : Ouvre un formulaire pour créer une nouvelle session de dépôt-vente.
3. **Catalogue** : Affiche tous les jeux disponibles avec options de tri et de filtrage.
4. **Jeux Déposés** : Permet de visualiser les jeux enregistrés par les vendeurs avec leurs statuts (vendu ou non vendu).
5. **+ Dépôt** : Permet aux vendeurs de déposer de nouveaux jeux.
6. **+ Jeu** : Ouvre un formulaire pour ajouter une description de jeu dans la base de données.
7. **Encaissement** : Permet de scanner des jeux et d’enregistrer les paiements des clients.
8. **Transactions** : Affiche toutes les transactions avec les détails des clients, vendeurs, et jeux.
9. **Trésorerie** : Présente le bilan financier global et les détails des frais, commissions, et sommes dues.
10. **User Management** : Gestion des clients, vendeurs et administrateurs avec leurs informations et rôles.
11. **Déconnexion** : Bouton pour quitter l’application en toute sécurité.

## Technologies Utilisées
- **Frontend** : Angular
- **Backend** : NestJS ([Lien du backend](https://github.com/sarlms/awi-backend))
- **Base de Données** : MongoDB Atlas

## Guide d’Installation

### Backend
1. Clonez le backend :
    ```bash
    git clone https://github.com/sarlms/awi-backend.git
    cd awi-backend
    npm install
    ```
2. Configurez les variables d’environnement dans un fichier `.env` :
    ```env
    MONGO_URI=your_mongo_database_url
    ```
3. Lancez le serveur :
    ```bash
    npm run start:dev
    ```

### Frontend
1. Clonez le frontend :
    ```bash
    git clone https://github.com/sarlms/awi-frontend.git
    cd awi-frontend
    npm install
    ```
2. Lancez l’application Angular :
    ```bash
    ng serve
    ```
3. Accédez à l’application sur [http://localhost:4200](http://localhost:4200).

---

Ah Oui est conçue pour transformer la gestion des systèmes de dépôt-vente de jeux en une expérience intuitive et efficace. Explorez, contribuez et faites évoluer ce projet ensemble !

# TempAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
