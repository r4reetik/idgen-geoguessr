const doOpenVerify = () => {
    const clickVerify = setInterval(() => {
        if (
            document.querySelector(
                "#tm-body > main > div.container > div > div.col-sm-12.col-md-12.col-lg-12.col-xl-8 > div.tm-content > div > div.inboxWarpMain > div > div.inbox-data-content > div.inbox-data-content-intro > div > div > div:nth-child(3) > a"
            )
        ) {
            document
                .querySelector(
                    "#tm-body > main > div.container > div > div.col-sm-12.col-md-12.col-lg-12.col-xl-8 > div.tm-content > div > div.inboxWarpMain > div > div.inbox-data-content > div.inbox-data-content-intro > div > div > div:nth-child(3) > a"
                )
                .click();

            clearInterval(clickVerify);

            chrome.runtime.sendMessage({ message: "doneOpenVerify" });
        }
    }, 100);
};

chrome.runtime.sendMessage({ message: "doneClickVerify" }, (response) => {
    if (response.message === "Success") {
        chrome.runtime.onMessage.addListener((req, sen, res) => {
            if (req.message === "startOpenVerify") {
                doOpenVerify();

                return true;
            }
        });
    }
});
