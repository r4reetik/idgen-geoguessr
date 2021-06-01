const generatePassword = () => {
    let length = 10,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    chrome.storage.local.set({ password: retVal });
};

const doVerification = () => {
    const clickPassword = setInterval(() => {
        if (
            document.getElementsByClassName("text-input")[0] &&
            document.getElementsByClassName("text-input")[1] &&
            document.getElementsByClassName("button__label")[0]
        ) {
            chrome.storage.local.get(["password"], (result) => {
                document.getElementsByClassName("text-input")[0].value = result.password;
                document
                    .getElementsByClassName("text-input")[0]
                    .dispatchEvent(new Event("input"));

                document.getElementsByClassName("text-input")[1].value = result.password;
                document
                    .getElementsByClassName("text-input")[1]
                    .dispatchEvent(new Event("input"));

                setTimeout(() => {
                    document
                        .querySelector(
                            "#__next > div > main > form > div > button > span.button__label"
                        )
                        .click();
                }, 100);
            });

            clearInterval(clickPassword);
        }
    }, 100);

    const sendMessage = setInterval(() => {
        if (document.querySelector("#__next > div > main > div > div > img")) {
            chrome.runtime.sendMessage({ message: "doneVerification" });
            clearInterval(sendMessage);
        }
    }, 100);
};

chrome.runtime.sendMessage({ message: "doneOpenVerify" }, (response) => {
    if (response.message === "Success") {
        chrome.runtime.onMessage.addListener((req, sen, res) => {
            if (req.message === "startVerification") {
                generatePassword();
                doVerification();

                return true;
            }
        });
    }
});
