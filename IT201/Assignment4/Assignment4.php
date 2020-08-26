<!DOCTYPE html>
<html lang = "en">
<head>
    <title> Smiles Galore </title>
</head>

<body>
    <?php
    $maxRows = 30;
    //Connect to the database
    $db = mysqli_connect("sql1.njit.edu", "hv72", "4eXQC0DJX", "hv72");

    //check is theres an error connecting
    if(!$db)
    {
        echo "<p>Error: </p>", mysqli_connect_errno();
        quit();
    }
    
    //Store user inputs into variables for future use
    $userName = $_REQUEST["username"];
    $userPassword = $_REQUEST["password"];
    $userID = $_REQUEST["identity"] + 0;
    $userEmail = $_REQUEST["email"];

    ///////////////////////////////////////////////////////////////////////
    $dentist = $_REQUEST["dentistIn"];
    $date = $_REQUEST["dateIn"];
    $better_date = strval(date('m/d/Y', strtotime($date)));
    $time = $_REQUEST["timeIn"];
    $better_time = strval(date('h:ia', strtotime($time)));
    $app = $_REQUEST["appIn"];
    $dropdown = $_REQUEST["list"];

    
    /*
    //testing stuff
    echo "Name: " , $userName , " Type: " , gettype($userName), "</br>";
    echo "Identity: " , $userID , " Type: " , gettype($userID), "</br>";
    echo "Password: " , $userPassword , " Type: " , gettype($userPassword), "</br>";
    echo "Email: " , $userEmail , " Type: " , gettype($userEmail), "</br>";
    //echo "Dropdown: " , $dropdown , "</br>";
    //echo "Dentist: " , $dentist , "</br>";
    //echo "Date: " , $date , "</br>";
    //echo "Date: " , $better_date , "</br>";
    //echo "Time: " , $time , "</br>";
    //echo "Time: " , $better_time , "</br>";
    //echo "App. Type: " , $app , "</br>";
    print "</br>";
    print "</br>";
    print "</br>";
    */

    
    $userExists = false;
    $user = "SELECT * FROM `patients` where Name = \"$userName\" and `Password` = \"$userPassword\" and `Number` = \"$userID\" and `Email` = \"$userEmail\"";
    $response = mysqli_query($db, $user);
    $num_row = mysqli_num_rows($response);
    print "Number of rows: " . $num_row .  "</br>";
    $ID = 0;
    //print "this is fucking bullshit </br>";
    //print_r($num_row);

    $result = mysqli_query($db, $user);
    //print "<table><caption> <h1> Patients Information Table </h1> </caption>";
    //print "<tr align = 'center'>";
    // Get the number of rows in the result      
    $num_rows = mysqli_num_rows($result);
    //print "Number of rows: " . $num_rows .  "</br>";
    // If there are rows in the result, put them in an HTML table      
    if ($num_rows > 0) 
    {       
        $row = mysqli_fetch_assoc($result);        
        $num_fields = mysqli_num_fields($result);
    
        // Produce the column labels        
        $keys = array_keys($row);        
        for ($index = 0; $index < $num_fields; $index++)
        {
            //print "<th>" . $keys[$index] . "</th>";
        }           
    
        //print "</tr>";
    
        // Output the values of the fields in the rows        
        for ($row_num = 0; $row_num < $num_rows; $row_num++) 
        {          
            //print "<tr>";          
            $values = array_values($row);          
            for ($index = 0; $index < $num_fields; $index++) 
            {            
                $value = htmlspecialchars($values[$index]);
                //print "<td>" . $value . "</td>";  
                if($index == 0)
                {
                    $ID = $value;
                }        
            }
    
            //print "</tr>";        
            $row = mysqli_fetch_assoc($result);        
        }      
    }      
    else 
    {        
        //print "There were no such rows in the table <br />";      
    }      
    //print "</table>";
    //print "</br>";
    //print "</br>";
    //print "</br>";

    
    if($response && $num_row > 0)//if the query goes through, then the user exists in the database
    {
        $userExists = true;
        //echo "This shit works </br>";
    }
    else if($num_row == 0)
    {
        $userExists = false;
        //echo "Account Not Found";
        //quit();
    }
    else//if it didnt go through, then set the user to doesnt exist in the database
    {
        echo "Error with query syntax";
        quit();
    }
    

    //WORKS
    if(strcmp("Search for Patient's Records", $dropdown) == 0 && $userExists == true)
    {
        $result = mysqli_query($db, $user);
        print "<table><caption> <h1> Patients Information Table </h1> </caption>";
        print "<tr align = 'center'>";
        // Get the number of rows in the result      
        $num_rows = mysqli_num_rows($result);
        //print "Number of rows: " . $num_rows .  "</br>";
        // If there are rows in the result, put them in an HTML table      
        if ($num_rows > 0) 
        {       
            $row = mysqli_fetch_assoc($result);        
            $num_fields = mysqli_num_fields($result);
    
            // Produce the column labels        
            $keys = array_keys($row);        
            for ($index = 0; $index < $num_fields; $index++)
            {
                print "<th>" . $keys[$index] . "</th>";
            }           
    
            print "</tr>";
    
            // Output the values of the fields in the rows        
            for ($row_num = 0; $row_num < $num_rows; $row_num++) 
            {          
                print "<tr>";          
                $values = array_values($row);          
                for ($index = 0; $index < $num_fields; $index++) 
                {            
                    $value = htmlspecialchars($values[$index]);
                    print "<td>" . $value . "</td>";        
                }
    
                print "</tr>";        
                $row = mysqli_fetch_assoc($result);        
            }      
        }      
        else 
        {        
            print "There were no such rows in the table <br />";      
        }      
        print "</table>";
        print "</br>";
        print "</br>";
        print "</br>";

        //echo "ID: " . $ID . "</br>";
        
        $dent = "SELECT * FROM `dentists` where ID = $ID";
        $result = mysqli_query($db, $dent);
        print "<table><caption> <h1> Appointment Information Table </h1> </caption>";
        print "<tr align = 'center'>";
        // Get the number of rows in the result      
        $num_rows = mysqli_num_rows($result);
        //print "Number of rows: " . $num_rows .  "</br>";
        // If there are rows in the result, put them in an HTML table      
        if ($num_rows > 0) 
        {       
            $row = mysqli_fetch_assoc($result);        
            $num_fields = mysqli_num_fields($result);
    
            // Produce the column labels        
            $keys = array_keys($row);        
            for ($index = 0; $index < $num_fields; $index++)
            {
                print "<th>" . $keys[$index] . "</th>";
            }           
    
            print "</tr>";
    
            // Output the values of the fields in the rows        
            for ($row_num = 0; $row_num < $num_rows; $row_num++) 
            {          
                print "<tr>";          
                $values = array_values($row);          
                for ($index = 0; $index < $num_fields; $index++) 
                {            
                    $value = htmlspecialchars($values[$index]);
                    print "<td>" . $value . "</td>";          
                }
    
                print "</tr>";        
                $row = mysqli_fetch_assoc($result);        
            }      
        }      
        else 
        {        
            print "There were no such rows in the table <br />";      
        }      
        print "</table>";
        print "</br>";
        print "</br>";
        print "</br>";
        quit();
    }
    /*
    else if(strcmp("Search for Patient's Records", $dropdown) == 0 && $userExists == false)
    {
        echo "User does not exist in the database </br>";
        echo "Create a new user account </br>";
        //quit();
    }
    */

    echo "ID: " . $ID . "</br>";

    //WORKS
    if(strcmp("Schedule an Appointment", $dropdown) == 0 && $userExists == true)
    {
        //Insert all the information

        $query = "INSERT INTO `dentists`(`ID`, `Doctor`, `Date`, `Time`, `Procedure`) VALUES ($ID,\"$dentist\",\"$better_date\",\"$better_time\",\"$app\")";
        $result = mysqli_query($db, $query);
        if($result)
        {
            echo "Appointment Added";
        }
        else
        {
            echo "Appointment Not Added";
        }
        //quit();
    }
    /*
    else if(strcmp("Schedule an Appointment", $dropdown) == 0 && $userExists == false)
    {
        echo "User does not exist in the database </br>";
        echo "Create a new user account </br>";
        //quit();
    }
    */

    //DOESNT WORK
    if(strcmp("Cancel an Appointment" , $dropdown) == 0 && $userExists == true)
    {
        //echo "Canceled an appointment </br>";
        $query = "DELETE FROM `dentists` where ID = $ID and Doctor = \"$dentist\" and 'Date' = \"$better_date\" and 'Time' = \"$better_time\"";// and 'Procedure' = \"$app\"";
        $result = mysqli_query($db, $query);
        if($result && mysqli_num_rows($result) > 0)
        {
            echo "Removed appointment";
            //quit();
        }
        else
        {
            echo "Appointment does not exist";
            //quit();
        }
        //remove given appointment time slot
        //quit();
    }
    /*
    else if(strcmp("Cancel an Appointment" , $dropdown) == 0 && $userExists == false)
    {
        echo "User does not exist in the database </br>";
        echo "Create a new user account </br>";
        //quit();
    }
    */

    //DOESNT WORK
    if(strcmp("Register/Create an Account", $dropdown) == 0 && $userExists == false)
    {
        $maxRows = $maxRows +1;
        $query = "INSERT INTO `patients`(`ID`, `Name`, `Password`, `Number`, `Email`) VALUES ($maxRows,\"$userName\",\"$userPassword\",\"$userID\",\"$userEmail\")";
        $result = mysqli_query($db, $query);
        if($result)
        {
            echo "Appointment Added";
        }
        else
        {
            echo "Appointment Not Added";
        }
        //quit();
    }
    /*
    else if("Register/Create an Account", $dropdown) == 0 && $userExists == true)
    {
        echo "User already exists in the database </br>";
        echo "Cannot create a new user account for existing user</br>";
        //quit();
    }
    */

    ?>
</body>