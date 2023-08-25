# EVE PI
an app that helps the player manage and configure planetary interaction on one or more accounts

## Loading Flow
(french)
Voici une liste de toutes les étapes de chargement de la webapp :
1. **L'authentification** : on essaye re récupérer un token SSO valide pour faire fonctionner l'application
2. **Le démarage** : on lance alors l'app svelte
3. **Le routage** : on détermine quel est la page à afficher en fonction de l'URL
4. **L'application est chargé**