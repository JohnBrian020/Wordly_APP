// Grab all the elements we'll need to work with
const form = document.getElementById("search");
const wordInput = document.getElementById("word");

const messageSection = document.querySelector(".message-section");
const results = document.getElementById("results");
const definitionDiv = document.getElementById("definition");
const pronunciationDiv = document.getElementById("pronunciation");
const audioElement = document.getElementById("audio");
const favouritesDiv = document.getElementById("favourites");
const themeBtn = document.getElementById("themeBtn");
const searchBtn = form.querySelector("button");
const favouriteBtn = document.querySelector("button[type='addToFavourites']");

let currentWord = null;

// Kick things off once the page is ready
document.addEventListener("DOMContentLoaded", () => {
    displayFavorites();

    // If they had dark mode on last time, bring it back
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
});

// Flip between dark and light mode
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// Wire up the search form
form.addEventListener("submit", handleSearch);

async function handleSearch(event) {
    event.preventDefault();

    const word = wordInput.value.trim().toLowerCase();
    if (word === "") {
        displayError("Please enter a word.");
        return;
    }

    clearResults();
    displayMessage("");
    setLoading(true);

    await fetchWord(word);

    setLoading(false);
}

// Go fetch the word's info from the dictionary API
async function fetchWord(word) {
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                displayError("We could not find that word. Check the spelling and try again.");
            } else {
                displayError("Something went wrong while loading the definition. Please try again.");
            }
            return;
        }

        const data = await response.json();
        displayWord(data);
    } catch (error) {
        displayError("Something went wrong while loading the definition. Please try again.");
    }
}

// Take the API response and actually put it on the page
function displayWord(data) {
    if (!Array.isArray(data) || data.length === 0) {
        displayError("Invalid data received.");
        return;
    }

    const entry = data[0];

    currentWord = {
        word: entry.word,
        phonetic: entry.phonetic || (entry.phonetics && entry.phonetics[0]?.text) || ""
    };

    // The word itself
    results.querySelector("h2").textContent = entry.word;

    // Definition section
    definitionDiv.innerHTML = "<h3>Definition</h3>";

    // Pronunciation section
    pronunciationDiv.innerHTML = `<h3>Pronunciation</h3>
        <p>${currentWord.phonetic || "Not Available"}</p>`;

    // Audio, if there's a clip available
    const audioUrl = getAudioUrl(entry);
    audioElement.innerHTML = "";

    if (audioUrl) {
        const button = document.createElement("button");
        button.textContent = "Play Audio";

        button.addEventListener("click", () => {
            const audio = new Audio(audioUrl);
            audio.play().catch(() => {
                displayMessage("Unable to play audio.");
            });
        });

        audioElement.appendChild(button);
    }

    // Loop through each meaning and build out the definitions
    if (entry.meanings) {
        entry.meanings.forEach((meaning) => {
            const part = document.createElement("h4");
            part.textContent = meaning.partOfSpeech;
            definitionDiv.appendChild(part);

            meaning.definitions.forEach((item) => {
                const p = document.createElement("p");
                p.textContent = item.definition;
                definitionDiv.appendChild(p);

                if (item.example) {
                    const example = document.createElement("p");
                    example.textContent = "Example: " + item.example;
                    definitionDiv.appendChild(example);
                }
            });

            const synonyms = getSynonyms(meaning);
            if (synonyms.length > 0) {
                const syn = document.createElement("p");
                syn.textContent = "Synonyms: " + synonyms.join(", ");
                definitionDiv.appendChild(syn);
            }
        });
    }

    // Link back to where the definition came from
    if (entry.sourceUrls && entry.sourceUrls.length > 0) {
        const link = document.createElement("a");
        link.href = entry.sourceUrls[0];
        link.target = "_blank";
        link.textContent = "Dictionary Source";
        definitionDiv.appendChild(link);
    }

    updateFavouriteButton();
}

// Just need the first audio clip we can find in the phonetics list
function getAudioUrl(entry) {
    if (!entry.phonetics) return "";

    for (const item of entry.phonetics) {
        if (item.audio) {
            return item.audio;
        }
    }

    return "";
}

// Pull synonyms from both the meaning level and each individual definition
function getSynonyms(meaning) {
    const list = [];

    if (meaning.synonyms) {
        list.push(...meaning.synonyms);
    }

    meaning.definitions.forEach(def => {
        if (def.synonyms) {
            list.push(...def.synonyms);
        }
    });

    return [...new Set(list)];
}

// Little helpers for showing messages to the user
function displayMessage(message) {
    messageSection.innerHTML = `<h2>Message</h2><p>${message}</p>`;
}

function displayError(message) {
    displayMessage(message);
}

// Toggle the search button's loading state
function setLoading(loading) {
    if (loading) {
        searchBtn.disabled = true;
        searchBtn.textContent = "Searching...";
    } else {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}

// Wipe the old results before showing new ones
function clearResults() {
    definitionDiv.innerHTML = "<h3>Definition</h3>";
    pronunciationDiv.innerHTML = "<h3>Pronunciation</h3>";
    audioElement.innerHTML = "";
}

// Reads whatever favourites we've got saved in local storage
function getFavorites() {
    try {
        const data = JSON.parse(localStorage.getItem("favorites"));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

// Add the word we're currently looking at to favourites
function saveFavorite() {
    if (!currentWord) return;

    const favorites = getFavorites();
    const exists = favorites.some(
        item => item.word.toLowerCase() === currentWord.word.toLowerCase()
    );

    if (!exists) {
        favorites.push(currentWord);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    displayFavorites();
    updateFavouriteButton();
}

// Drop a word out of favourites
function removeFavorite(word) {
    const favorites = getFavorites().filter(
        item => item.word.toLowerCase() !== word.toLowerCase()
    );

    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayFavorites();
    updateFavouriteButton();
}

// Build out the favourites list in the sidebar
function displayFavorites() {
    const favorites = getFavorites();
    favouritesDiv.innerHTML = "<h2>Favourites</h2>";

    if (favorites.length === 0) {
        favouritesDiv.innerHTML += "<p>No favourite words saved yet.</p>";
        return;
    }

    favorites.forEach(item => {
        const container = document.createElement("div");

        const wordBtn = document.createElement("button");
        wordBtn.textContent = item.word;
        wordBtn.addEventListener("click", () => {
            wordInput.value = item.word;
            fetchWord(item.word);
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
            removeFavorite(item.word);
        });

        container.appendChild(wordBtn);
        container.appendChild(removeBtn);
        favouritesDiv.appendChild(container);
    });
}

// Keep the "Add to Favourites" button in sync with whether the word's already saved
function updateFavouriteButton() {
    if (!currentWord) return;

    const favorites = getFavorites();
    const exists = favorites.some(
        item => item.word.toLowerCase() === currentWord.word.toLowerCase()
    );

    if (exists) {
        favouriteBtn.textContent = "Saved";
        favouriteBtn.disabled = true;
        favouriteBtn.classList.add("saved");
    } else {
        favouriteBtn.textContent = "Add To Favourites";
        favouriteBtn.disabled = false;
        favouriteBtn.classList.remove("saved");
    }
}

favouriteBtn.addEventListener("click", () => {
    saveFavorite();
});