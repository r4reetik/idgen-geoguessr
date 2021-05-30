window.addEventListener("load", () => {
    let cards = document.getElementsByClassName("card");
    for (const card of cards) {
        card.addEventListener("click", () => {
            for (const card of cards) {
                card.classList.remove("selected");
            }
            card.classList.add("selected");
            chrome.storage.local.set(
                {
                    game: card.getElementsByClassName("card-text")[0].innerText,
                },
                () => {}
            );
        });
    }
});
