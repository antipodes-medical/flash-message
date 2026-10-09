# Flash message

Bandeau de confirmation `<flash-message>` : vert, centré en bas de l'écran, avec
bouton de fermeture, barre de progression et fermeture automatique.

Web component sans dépendance (~3 Ko). Remplace `kami-flash` (~450 Ko) avec les
mêmes attributs : le HTML existant n'a pas à changer.

# Installation

```bash
yarn add @antipodes-medical/flash-message
```

```js
// Enregistre <flash-message> (une seule fois, même si importé plusieurs fois).
import '@antipodes-medical/flash-message';
```

# Utilisation

Dans le HTML (par exemple imprimé par PHP après l'envoi d'un formulaire) :

```html
<flash-message time="5000" progressbar="true" message="Merci pour votre message"></flash-message>
```

En JavaScript :

```js
const flash = document.createElement('flash-message');
flash.setAttribute('message', 'Votre message a bien été envoyé');
flash.setAttribute('time', 5000);
flash.setAttribute('progressbar', 'true');
document.body.append(flash);
```

Fermeture depuis le code : `flash.close()`.

## Attributs

| Attribut      | Rôle                                                        | Défaut |
| ------------- | ----------------------------------------------------------- | ------ |
| `message`     | Texte affiché. Inséré comme texte, jamais comme HTML.       | vide   |
| `time`        | Fermeture automatique après ce délai (ms). Absent : reste. | —      |
| `progressbar` | Affiche la barre de progression (si `time` est défini).     | absent |

## Personnalisation

Le style est dans le shadow DOM ; il se règle depuis le CSS du site avec ces variables :

```css
:root {
  --flash-message-offset: 55px;        /* distance au bas de l'écran */
  --flash-message-background: #00bf9a; /* fond */
  --flash-message-color: #fff;         /* texte et icônes */
  --flash-message-progress: #008e72;   /* barre de progression */
  --font-family-sans: 'Poppins';       /* police (sinon sans-serif) */
}
```

# Changements de la 3.0.0

- Rendu dans le shadow DOM : les règles CSS du site visant `.flash-message-container`
  ne s'appliquent plus. Utiliser les variables ci-dessus.
- Le bandeau est positionné (fixe, en bas, centré) et animé à l'entrée et à la sortie.
- `time` ferme le bandeau même sans `progressbar`.
- Le message est inséré comme texte (plus de HTML interprété).
- Attributs posés après `document.createElement` désormais pris en compte.
- Accessibilité : `role="status"`, bouton de fermeture avec libellé, `prefers-reduced-motion`.
