function extra(that) {
    //var dropChoice = document.getElementById("list");
    var den1 = document.getElementById("dentist");
    var den2 = document.getElementById("dentistIn");
    var den3 = document.getElementById("dentistOut");

    //Date Block
    var date1 = document.getElementById("date");
    var date2 = document.getElementById("dateIn");
    var date3 = document.getElementById("dateOut");

    //Time Block
    var time1 = document.getElementById("time");
    var time2 = document.getElementById("timeIn");
    var time3 = document.getElementById("timeOut");

    //Appointment Block
    var app1 = document.getElementById("app");
    var app2 = document.getElementById("appIn");
    var app3 = document.getElementById("appOut");

    //Email Requiremnet
    var text = document.getElementById("emailReq");

    if (that.value == "Schedule an Appointment" || that.value == "Cancel an Appointment") {
        //
        den1.style.display = "inline-block";
        den2.style.display = "inline-block";
        den3.style.display = "inline-block";
        date1.style.display = "inline-block";
        date2.style.display = "inline-block";
        date3.style.display = "inline-block";
        time1.style.display = "inline-block";
        time2.style.display = "inline-block";
        time3.style.display = "inline-block";
        app1.style.display = "inline-block";
        app2.style.display = "inline-block";
        app3.style.display = "inline-block";
    }
    else {
        den1.style.display = "none";
        den2.style.display = "none";
        den3.style.display = "none";
        date1.style.display = "none";
        date2.style.display = "none";
        date3.style.display = "none";
        time1.style.display = "none";
        time2.style.display = "none";
        time3.style.display = "none";
        app1.style.display = "none";
        app2.style.display = "none";
        app3.style.display = "none";
    }

    if (that.value == "Register/Create an Account") {

        text.style.display = "inline-block";
    }
    else {
        text.style.display = "none";
    }

    if (that.value == "Search for Patient's Records") {
        den1.style.display = "none";
        den2.style.display = "none";
        den3.style.display = "none";
        date1.style.display = "none";
        date2.style.display = "none";
        date3.style.display = "none";
        time1.style.display = "none";
        time2.style.display = "none";
        time3.style.display = "none";
        app1.style.display = "none";
        app2.style.display = "none";
        app3.style.display = "none";
    }

}


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

