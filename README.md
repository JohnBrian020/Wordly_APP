# Wordly_APP
# Wordly_APP
# Wordly_APP

# Wordly Dictionary SPA

## Description

Wordly is a single-page dictionary app I built for looking up English words — definitions, synonyms, pronunciation. It's a Single Page Application, nothing ever reloads: you search, get your results, save favorites, and flip the theme, all without the page refreshing on you.

It doesn't come with a built-in dictionary of its own. Instead it calls a free public dictionary API. Every result is pulled live .

## Features

- Word search — type in any English word and look it up through a simple search form
- Definitions and parts of speech — meanings are grouped by noun, verb, adjective, and so on, so they're easy to scan
-  Pronunciation text  — shows the phonetic spelling of the word
-  Audio pronunciation  — hit play to hear the word spoken, when a clip is available
-  Examples  — sample sentences so you can see the word used in context
-  Synonyms  — a quick list of related words with similar meanings
-  Favorites  — save words you want to remember using the browser's localStorage, and remove them whenever you like
-  Responsive design  — works whether you're on a phone, tablet, or desktop
-  Theme toggle  — switch between light and dark mode, and it'll remember your choice next time you come back

## Technologies Used

-  HTML  for the page structure
-  CSS  for styling and theming (light/dark mode is handled with CSS variables)
-  JavaScript  for the app logic, DOM updates, and talking to the API
-  Free Dictionary API  as the source of definitions, phonetics, and audio
-  localStorage  to remember favorite words and theme choice between visits

## Project Structure

```
wordly-app/
index.html
css/style.css
js/index.js
assets/screenshot.png
README.md
```

## How to Run the Project

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in your browser .For live-reloading , use VS Code's  Live Server  extension.
4. Type a word into the search box and hit  Search.

## API Information

Wordly runs on the  Free Dictionary API .

 Endpoint format: 
```
https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

Whenever you search for a word, the app makes a request at this endpoint. If the word exists, it comes back with meanings, pronunciation, audio (when there's a clip for it), example sentences, synonyms, and a source link — and the app lays all of that out on the page for you.

## Usage

1. Type a word into the search box.
2. Click  Search .
3. Read through the definition, part of speech, and pronunciation in the results section.
4. Hit  Play Audio  if there's a clip available.
5. Click  Add to Favourites  to save a word, or remove it later from your Favourites list.



## Known Limitations

- Not every word has audio, examples, or synonyms — it depends entirely on what the API has on file.
- Right now it only works with  English  words.
- Favorites live in your browser's localStorage, so they're tied to that browser/device and won't follow you elsewhere.

## Author

Built by JOHN BRIAN WAWERU
GitHub: JohnBrian020
## License

This was built as a learning project.
