<!DOCTYPE html>
<html>
    <body>
        <?php

        $db = mysqli_connect("sql1.njit.edu", "hv72", "4eXQC0DJX", "hv72");

        //check is theres an error connecting
        if(!$db)
        {
            echo "<p>Error: </p>", mysqli_connect_errno();
            quit();
        }

        //if you have access, then proceed with this stuff:
        //this will print out the patients table
        $query = "SELECT * FROM `patients`, `dentists` WHERE patients.ID=dentists.ID";
        $result = mysqli_query($db, $query);
         print "<table><caption> <h1> Appointment Information Table </h1> </caption>";
         print "<tr align = 'center'>";
         // Get the number of rows in the result      
         $num_rows = mysqli_num_rows($result);
 
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

        ?>
    </body>
</html>