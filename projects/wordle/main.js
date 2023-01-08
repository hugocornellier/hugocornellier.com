// Submit word for crosscheck with hidden word
function submit()
{
    const currRow = document.getElementsByClassName("active")[0];
    const currBoxes = currRow.getElementsByClassName("filled");

    // Allow submissions for 5-letter words only.
    if (currBoxes.length == 5)
    {
        var index = 0;
        var win = 0;
        const entered_word = get_entered_word(currBoxes);
        if (all_words.includes(get_entered_word(currBoxes)))
        {
            resetSubmitButton();
            for (const el of currBoxes)
            {
                // Perfect match
                var currLetter = el.innerHTML;
                var compareTo = word.charAt(index);
                console.log("Comparing " + currLetter + " to " + compareTo);
                if (currLetter == compareTo)
                {
                    console.log("perfect match at " + index);
                    el.style.backgroundColor = "green";
                    el.style.color = "white";
                    win++;
                }
                // Indirect match
                else if (word.includes(currLetter))
                {
                    console.log("indirect match at " + index);
                    el.style.backgroundColor = "orange";
                    el.style.color = "white";
                }
                index++;
            }
            const arr = entered_word.split("");
            document.querySelectorAll('.letter-box-clickable').forEach(box => {
                var curr = box.innerHTML;
                if (arr.includes(curr.toLowerCase())) {
                    box.style.border = "1px solid grey";
                }
            });
            currRow.classList.remove("unsent");
            currRow.classList.remove("active");
        }
        else {
            const dangerAlert = document.getElementById("danger-alert");
            dangerAlert.innerHTML = 'Not a real word';
            dangerAlert.style.visibility = 'visible';
            for (var i = 0; i < word.length; i++)
                erase();
            setTimeout(function () {
                dangerAlert.innerHTML = '';
                dangerAlert.style.visibility = 'hidden';
            }, 5000);
        }
    }
    if (win == 5)
        console.log("YOU WIN");
}

function resetSubmitButton()
{
    const submitButton = document.getElementById("submit-button");
    submitButton.style.border = "1px solid lightgrey";
    submitButton.style.color = "grey";
    submitButton.style.background = "white";
    submitButton.style.cursor = "default";
}

function erase()
{
    const currRow = document.getElementsByClassName("active")[0];
    const currBoxes = currRow.getElementsByClassName("filled");
    var currBoxesLength = currBoxes.length;
    const currBox = currBoxes[currBoxesLength - 1];
    if (currBoxesLength == 5) {
        currRow.classList.remove("unsent");
        resetSubmitButton();
    }
    if (currBoxesLength > 0) {
        currBox.innerHTML = "";
        currBox.classList.remove("filled");
        currBox.classList.add("empty");
        currBox.style.background = "white";
    }
}

function add_letter(letter)
{
    const currRow = document.getElementsByClassName("active")[0];
    const currBoxes = currRow.getElementsByClassName("empty");
    var boxesRemaining = currBoxes.length - 1;
    if (boxesRemaining >= 0)
    {
        const currBox = currBoxes[0];
        currBox.innerHTML = letter;
        currBox.classList.remove("empty");
        currBox.classList.add("filled");
        currBox.style.backgroundColor = "grey";
        currBox.style.color = "white";
    }

    if (boxesRemaining == 0)
    {
        currRow.classList.add("unsent");
        const submitButton = document.getElementById("submit-button");
        submitButton.style.border = "1px solid green";
        submitButton.style.color = "white";
        submitButton.style.background = "darkgreen";
        submitButton.style.cursor = "pointer";
    }
}

// Test
function myFunction() {
    document.getElementById("test").innerHTML = "YOU CLICKED ME!";
}

// Takes div ID and updates HTML content within div.
function update_html_content(divID, content)
{
    const elem = document.getElementById(divID);
    elem.innerHTML = content;
}

// Return either a full text file               || if alltext = true
// OR returns a random line from the text file  || if alltext = false
function readTextFile (allText)
{
    var file = "fiveletters.txt";
    var line = "";
    var splitData;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if (rawFile.readyState === 4)
        {
            if (rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                splitData = allText.split('\n');
                const randomNumber = Math.floor(Math.random() * splitData.length);
                line = splitData.splice(randomNumber, 1);
            }
        }
    }
    rawFile.send(null);
    if (allText)
        return splitData;
    else
        return line;
}

// Detect keypress by user
function KeyPress(e)
{
    var evtobj = window.event? event : e
    var key = evtobj.keyCode || evtobj.charCode;

    // Detect ctrl+z/cmd+z & erase/delete
    if ((evtobj.keyCode == 90 && (e.ctrlKey || e.metaKey))|| key == 8)
        erase();

    // Detect characters entered via keyboard
    if (isCharacterKeyPress(e))
        add_letter(String.fromCharCode(key));

}
document.onkeydown = KeyPress;

function isCharacterKeyPress(evt) {
    if (typeof evt.which == "undefined") {
        // This is IE, which only fires keypress events for printable keys
        return true;
    } else if (typeof evt.which == "number" && evt.which > 0) {
        // In other browsers except old versions of WebKit, evt.which is
        // only greater than zero if the keypress is a printable key.
        // We need to filter out backspace and ctrl/alt/meta key combinations
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
    }
    return false;
}

// Return user-entered word from active row.
function get_entered_word(currBoxes)
{
    var curr_word = "";
    for (const el of currBoxes)
        curr_word += el.innerHTML;

    // Return lowercase word to match fiveletters.txt
    return curr_word.toLowerCase();
}
