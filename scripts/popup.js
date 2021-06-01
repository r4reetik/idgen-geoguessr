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

    document.getElementById("btnGenID").addEventListener("click", () => {
        chrome.runtime.sendMessage({ message: "startGenID" }, (response) => {
            if (response.message === "Success") {
                self.close();
            } else {
                console.log("Something went wrong!!!");
            }
        });
    });

    chrome.storage.local.get(["game"], (result) => {
        if (result.game) {
            for (const card of cards) {
                if (card.getElementsByClassName("card-text")[0].innerText === result.game) {
                    card.click();
                }
            }
        } else {
            cards[3].click();
        }
    });
});
