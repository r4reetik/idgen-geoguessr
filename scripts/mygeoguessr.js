const checkSignOut = () => {
    if (document.getElementsByClassName("user-nick")[0]) {
        return true;
    }
    return false;
};

const doSignOut = () => {
    if (checkSignOut()) {
        const clickProfile = setInterval(() => {
            if (document.getElementsByClassName("user-nick")[0].innerText) {
                document.getElementsByClassName("user-nick")[0].click();
                clearInterval(clickProfile);
            }
        }, 100);

        const clickSignOut = setInterval(() => {
            if (
                document.querySelector(
                    "#__next > div > main > div > div > div.card-wrapper.card-wrapper--with-pin.card-wrapper--pin-size-small.margin--bottom > div.card.card--white.card--large-spacing > div > div.buttons.margin--top > a:nth-child(1) > span.button__label"
                )
            ) {
                document
                    .querySelector(
                        "#__next > div > main > div > div > div.card-wrapper.card-wrapper--with-pin.card-wrapper--pin-size-small.margin--bottom > div.card.card--white.card--large-spacing > div > div.buttons.margin--top > a:nth-child(1) > span.button__label"
                    )
                    .click();
                clearInterval(clickSignOut);
            }
        }, 100);

        const clickSignUp = setInterval(() => {
            if (document.getElementsByClassName("header__signup")[0]) {
                document.getElementsByClassName("header__signup")[0].click();
                clearInterval(clickSignUp);
            }
        });

        chrome.runtime.sendMessage({ message: "doneSignOut" });
    } else {
        const clickSignUp = setInterval(() => {
            if (document.getElementsByClassName("header__signup")[0]) {
                document.getElementsByClassName("header__signup")[0].click();
                clearInterval(clickSignUp);
            }
        });

        chrome.runtime.sendMessage({ message: "doneSignOut" });
    }
};

const doSendVerify = () => {
    const inputMail = setInterval(() => {
        console.log("l1");
        if (document.getElementsByClassName("text-input")[0]) {
            chrome.storage.local.get(["tempMail"], (result) => {
                document.getElementsByClassName("text-input")[0].value = result.tempMail;

                document
                    .getElementsByClassName("text-input")[0]
                    .dispatchEvent(new Event("input"));

                clearInterval(inputMail);

                const clickFilled = setInterval(() => {
                    if (
                        document.querySelector(
                            "#__next > div > main > div > div > div > div > div > form > div > div.form-field.form-field--actions > div > button > span.button__label"
                        )
                    ) {
                        document
                            .querySelector(
                                "#__next > div > main > div > div > div > div > div > form > div > div.form-field.form-field--actions > div > button > span.button__label"
                            )
                            .click();

                        clearInterval(clickFilled);
                        chrome.runtime.sendMessage({ message: "doneSendVerify" });
                    }
                }, 100);
            });
        }
    }, 100);
};

const doOpenGame = (game) => {
    for (let i = 1; i <= 3; i++) {
        if (
            document.querySelector(
                "#__next > div > main > div > div > div > section:nth-child(3) > section > section:nth-child(" +
                    i +
                    ") > article > div.map-teaser__body > h3 > a"
            ).innerText === game
        ) {
            document
                .querySelector(
                    "#__next > div > main > div > div > div > section:nth-child(3) > section > section:nth-child(" +
                        i +
                        ") > article > div.map-teaser__body > h3 > a"
                )
                .click();

            return;
        }
    }
};

const doStartGame = () => {
    chrome.storage.local.get(["game"], (result) => {
        if (result.game != "Select Manually") {
            doOpenGame(result.game);
        } else {
            console.log("Done!!!");
        }
    });
};

chrome.runtime.sendMessage({ message: "readySignOut" }, (response) => {
    if (response.message === "Success") {
        chrome.runtime.onMessage.addListener((req, sen, res) => {
            if (req.message === "startSignOut") {
                res({ message: "Success" });
                chrome.storage.local.get(["statusSignOut"], (result) => {
                    if (result.statusSignOut === "N") {
                        chrome.storage.local.set({ statusSignOut: "Y" });
                        doSignOut();
                    }
                });

                return true;
            } else if (req.message === "startSendVerify") {
                res({ message: "Success" });
                chrome.storage.local.get(["statusSendVerify"], (result) => {
                    if (result.statusSendVerify === "N") {
                        chrome.storage.local.set({ statusSendVerify: "Y" });
                        doSendVerify();
                    }
                });

                return true;
            } else if (req.message === "startGame") {
                res({ message: "Success" });

                doStartGame();

                return true;
            }
        });
    } else {
        console.log("Something went wrong!!!");
    }
});
