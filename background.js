chrome.runtime.onInstalled.addListener(() => {});

chrome.runtime.onMessage.addListener((req, sen, res) => {
    if (req.message === "startGenID") {
        res({ message: "Success" });

        chrome.storage.local.set({ statusSignOut: "N" });
        chrome.storage.local.set({ statusSendVerify: "N" });

        chrome.tabs.create({ url: "https://www.geoguessr.com/" }, (newTab) => {
            chrome.storage.local.set({ ggTabID: newTab.id });
        });

        return true;
    } else if (req.message === "readySignOut") {
        res({ message: "Success" });
        chrome.storage.local.get(["ggTabID", "statusSignOut", "statusSendVerify"], (result) => {
            if (result.statusSignOut === "Y" && result.statusSendVerify === "Y") {
                chrome.tabs.sendMessage(
                    result.ggTabID,
                    { message: "startGame" },
                    (response) => {
                        if (response.message != "Success") {
                            console.log("Something went wrong!!!");
                        }
                    }
                );
            } else {
                chrome.tabs.sendMessage(
                    result.ggTabID,
                    { message: "startSignOut" },
                    (response) => {
                        if (response.message != "Success") {
                            console.log("Something went wrong!!!");
                        }
                    }
                );
            }
        });

        return true;
    } else if (req.message === "doneSignOut") {
        chrome.storage.local.set({ statusChangedMail: "N" });
        chrome.storage.local.set({ statusCopyMail: "N" });
        chrome.tabs.create({ url: "https://www.temp-mail.org/en/" }, (newTab) => {
            chrome.storage.local.set({ tmTabID: newTab.id });
        });

        return true;
    } else if (req.message === "readyMail") {
        res({ message: "Success" });
        chrome.storage.local.get(["tmTabID"], (result) => {
            chrome.tabs.sendMessage(
                result.tmTabID,
                { message: "startCopyMail" },
                (response) => {
                    if (response.message != "Success") {
                        console.log("Something went wrong!!!");
                    }
                }
            );
        });

        return true;
    } else if (req.message === "doneMailCopy") {
        chrome.storage.local.get(["ggTabID"], (result) => {
            chrome.tabs.update(result.ggTabID, { active: true, highlighted: true });
            console.log(result.ggTabID);
            chrome.tabs.sendMessage(
                result.ggTabID,
                { message: "startSendVerify" },
                (response) => {
                    if (response.message != "Success") {
                        console.log("Something went wrong!!!");
                    }
                }
            );
        });

        return true;
    } else if (req.message === "doneSendVerify") {
        chrome.storage.local.get(["tmTabID"], (result) => {
            chrome.tabs.update(result.tmTabID, { active: true, highlighted: true });
            chrome.tabs.sendMessage(
                result.tmTabID,
                { message: "startClickVerify" },
                (response) => {
                    if (response.message != "Success") {
                        console.log("Something went wrong!!!");
                    }
                }
            );
        });

        return true;
    } else if (req.message === "doneClickVerify") {
        res({ message: "Success" });

        chrome.storage.local.get(["tmTabID"], (result) => {
            chrome.windows.getAll({ populate: true }, function (windows) {
                windows.forEach(function (window) {
                    window.tabs.forEach(function (tab) {
                        if (
                            tab.url.indexOf("geoguessr.com") > -1 ||
                            (tab.url.indexOf("temp-mail.org/en") > -1 &&
                                tab.id != result.tmTabID)
                        ) {
                            chrome.tabs.remove(tab.id);
                        }
                    });
                });
            });
        });

        chrome.windows.getAll({ populate: true }, function (windows) {
            windows.forEach(function (window) {
                window.tabs.forEach(function (tab) {
                    if (tab.url.indexOf("temp-mail.org/en/view/") > -1) {
                        chrome.storage.local.set({ tmTabID: tab.id });
                    }
                });
            });
        });

        chrome.storage.local.get(["tmTabID"], (result) => {
            chrome.tabs.sendMessage(
                result.tmTabID,
                { message: "startOpenVerify" },
                (response) => {
                    if (response.message != "Success") {
                        console.log("Something went wrong");
                    }
                }
            );
        });

        return true;
    } else if (req.message === "doneOpenVerify") {
        res({ message: "Success" });
        chrome.windows.getAll({ populate: true }, function (windows) {
            windows.forEach(function (window) {
                window.tabs.forEach(function (tab) {
                    if (tab.url.indexOf("geoguessr.com/profile/set-password/") > -1) {
                        chrome.storage.local.set({ ggTabID: tab.id });
                        chrome.tabs.sendMessage(
                            tab.id,
                            { message: "startVerification" },
                            (response) => {
                                if (response.message != "Success") {
                                    console.log("Something went wrong!!!");
                                }
                            }
                        );
                    }
                });
            });
        });

        return true;
    } else if (req.message === "doneVerification") {
        chrome.storage.local.get(["ggTabID"], (result) => {
            chrome.windows.getAll({ populate: true }, function (windows) {
                windows.forEach(function (window) {
                    window.tabs.forEach(function (tab) {
                        if (
                            tab.url.indexOf("temp-mail.org/en") > -1 ||
                            tab.url.indexOf("geoguessr.com") > -1
                        ) {
                            chrome.tabs.remove(tab.id);
                        }
                    });
                });
            });
        });

        chrome.tabs.create({ url: "https://www.geoguessr.com/" }, (newTab) => {
            chrome.storage.local.set({ ggTabID: newTab.id });
        });

        return true;
    } else if (req.message === "doneOpenMap") {
        res({ message: "Success" });

        chrome.storage.local.get(["ggTabID"], (result) => {
            chrome.tabs.sendMessage(result.ggTabID, { message: "startMap" }, (response) => {
                if (response.message != "Success") {
                    console.log("Something went wrong!!!");
                }
            });
        });

        return true;
    }
});
