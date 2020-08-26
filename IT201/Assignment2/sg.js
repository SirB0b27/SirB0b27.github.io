function showText() {
    var check = document.getElementById("check");
    var text = document.getElementById("emailReq");
    if (check.checked == true) {
        text.style.display = "inline-block";
    }
    else {
        text.style.display = "none";
    }
}

function validate() {
    var name = document.forms["login-form"]["name"];
    var password = document.forms["login-form"]["password"];
    var ids = document.forms["login-form"]["ID"];
    var email = document.forms["login-form"]["email"];
    var check = document.getElementById("check");

    var checkName = true;
    var checkPassword = true;
    var checkIds = true;
    var checkEmail = true;

    //validate name
    if (name.value == "") {
        window.alert("Please enter a name");
        name.focus();
        checkName = false;
    }

    //validate the password
    var checkCapital = false;
    var checkDigit = false;
    for (i = 0; i < password.value.length; i++) {
        if (password.value[i] >= '0' && password.value[i] <= '9') {
            checkDigit = true;
        }
        if (password.value[i] == password.value[i].toUpperCase()) {
            checkCapital = true;
        }
    }
    if (password.value == "" || password.value.length > 8 || !(checkDigit && checkCapital)) {
        window.alert("Please enter a valid password:\n" + "------------------------------------------------------------\n"
            + "Password must start with an upper case letter\n" + "Password must be at max 8 characters in length");
        password.focus();
        checkPassword = false;
    }

    //validate the ID
    if (ids.value == null || ids.value.length != 8) {
        window.alert("Please enter a valid ID:\n" + "------------------------------------------------------------\n"
            + "IDs are a unique 8-digit number");
        ids.focus();
        checkIds = false;
    }

    //validate the email
    var containsPeriod = false;
    var containsAt = false;
    for (i = 0; i < email.value.length; i++) {
        if (email.value[i] == '.') {
            containsPeriod = true;
        }
        if (email.value[i] == '@') {
            containsAt = true;
        }
    }
    if (check.checked) {
        if (email.value == "" || !(containsPeriod && containsAt)) {
            window.alert("Please enter a valin email:\n" + "------------------------------------------------------------\n"
                + "Emails contain: '@' and '.'");
            email.focus();
            checkEmail = false;
        }
    }
    var choice = document.getElementById("list");
    //if all values were checked and are true then verify the account
    if (checkName == true && checkPassword == true && checkIds == true && checkEmail == true) {
        //document.write(verify(name, password, ids));
        if (verify(name, password, ids) == true) {
            if (check.checked) {
                window.alert("Welcome " + name.value + ", you have chosent to do: \n" + choice.options[choice.selectedIndex].value + "\n\nAn Transcript Confirmation will be emailed to: \n" + email.value);
            }
            else {
                window.alert("Welcome, " + name.value + ", you have chosent to do: \n" + choice.options[choice.selectedIndex].value);
            }
        }
    }

}

function verify(name, password, ids) {

    //create an array of existing users
    var users = ["Bob", "Billy", "Jim", "Jerry", "Keith", "Klien"];

    //create a dictionary of existing users password and ids
    userInfo = {
        "Bob": ["z3N6BICs", 13039299],
        "Billy": ["Yf9yaQL2", 34221786],
        "Jim": ["v4ubo6E", 26887960],
        "Jerry": ["5KvLvBR", 23473769],
        "Keith": ["IAv0ty", 23786709],
        "Klien": ["wq3YLA", 74953431]
    };

    // go through each name looking to find the name
    for (var i = 0; i < users.length; i++) {
        //if name exists
        if (name.value == users[i]) {
            //window.alert("Name = " + users[i] + "\n" + "Password: " + userInfo[name.value][0] + "\n" + "ID: " + userInfo[users[i]][1]);

            //check for password error
            if (password.value != userInfo[users[i]][0]) {
                window.alert("Incorrect Password");
                return false;
            }

            //check for id error
            if (ids.value != userInfo[users[i]][1]) {
                window.alert("Incorrect ID number");
                return false;
            }
            //if theres no error
            return true;
        }
    }

    //name could not be found
    window.alert("User with name: " + name.value + ", does not exist on our server");
    return false;
}