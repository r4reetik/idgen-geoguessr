const doStartMap = () => {
    setTimeout(() => {
        document
            .querySelector(
                "#__next > div > main > div > div > div.map-block > div.map-block__actions > button > span.button__label"
            )
            .click();
    }, 100);
    
    const clickPlayModal = setInterval(() => {
        if (
            document.querySelector(
                "#__next > section > div > div.buttons.confirmation-dialog__actions > button.button.button--medium.button--primary.confirmation-dialog__action > span.button__label"
            )
        ) {
            document
                .querySelector(
                    "#__next > section > div > div.buttons.confirmation-dialog__actions > button.button.button--medium.button--primary.confirmation-dialog__action > span.button__label"
                )
                .click();
            clearInterval(clickPlayModal);
        }
    }, 100);
};

chrome.runtime.sendMessage({ message: "doneOpenMap" }, (response) => {
    if (response.message === "Success") {
        chrome.runtime.onMessage.addListener((req, sen, res) => {
            if (req.message === "startMap") {
                doStartMap();

                return true;
            }
        });
    }
});
