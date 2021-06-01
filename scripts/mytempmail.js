const doCopyMail = () => {
    const setMail = setInterval(() => {
        if (
            document.getElementById("mail") &&
            document.getElementById("mail").value &&
            document.getElementById("mail").value != "Loading" &&
            document.getElementById("mail").value != "Loading." &&
            document.getElementById("mail").value != "Loading.." &&
            document.getElementById("mail").value != "Loading..."
        ) {
            chrome.storage.local.set({ tempMail: document.getElementById("mail").value });
            clearInterval(setMail);
            chrome.runtime.sendMessage({ message: "doneMailCopy" });
        }
    }, 100);
};

const doNewMail = () => {
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload();
};

const doClickVerify = () => {
    const clickVerify = setInterval(() => {
        if (document.getElementsByClassName("title-subject")[1]) {
            document.getElementsByClassName("title-subject")[1].click();
            clearInterval(clickVerify);
        }
    }, 100);
};

chrome.storage.local.get(["statusChangedMail", "statusCopyMail"], (result) => {
    chrome.runtime.sendMessage({ message: "readyMail" }, (response) => {
        if (response.message === "Success") {
            chrome.runtime.onMessage.addListener((req, sen, res) => {
                if (req.message === "startCopyMail") {
                    res({ message: "Success" });
                    if (result.statusChangedMail === "N") {
                        chrome.storage.local.set({ statusChangedMail: "Y" });
                        doNewMail();
                    } else if (result.statusCopyMail === "N") {
                        chrome.storage.local.set({ statusCopyMail: "Y" });
                        doCopyMail();
                    }

                    return true;
                } else if (req.message === "startClickVerify") {
                    res({ message: "Success" });

                    doClickVerify();

                    return true;
                }
            });
        } else {
            console.log("Something went wrong!!!");
        }
    });
});
