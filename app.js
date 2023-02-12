//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request")
const https=require("https")

const app= express();

//we use "static folder (here "public")" (L-248,15:00)to add local folders to be accessible by server 
//so that css and images can be applied to website 

//asking app to use following with keyword ".use"
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))


app.get("/",function(req,res){
    res.sendFile(__dirname +"/signup.html")
})


app.post("/",function(req,res){
    // var firstName=req.body.fname;  //"fname"--name in input tag
    // var lastName=req.body.lname;
    // var email=req.body.email;
     
    //we dont want our data to get changed so set "const"
    const firstName=req.body.fname;  //"fname"--name in input tag
    const lastName=req.body.lname;
    const email=req.body.email;
     
    //JSON data based on mailchimp requirement
    const  data={
        members:[
            {
               email_address:email,
               status:"subscribed",
               merge_fields:{
                FNAME:firstName,
                LNAME:lastName
               }
            }
        ]
    };

    const jsonData=JSON.stringify(data);
     

    const url="https://us9.api.mailchimp.com/3.0/lists/ad9818185e"  //ad9818185e--list-id see filr API
     
    //creating options for http request
    const options={
        method:"POST",
        //authentication method
        auth:"abd:97222ad160ae7fb40709c8f42b3d1b61-us9"  //name:API Key
    }

    const request= https.request(url,options, function(response){
         
        //checking subscribed or not and displaying
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

         response.on("data",function(data){
            console.log(JSON.parse(data));
         })
    })
  
   //to write data to mailchimp server

   request.write(jsonData);
   
   request.end();  //writing finished
   

})

//in case of failure --Navigating/redirect to Home page on clicking Button -TRY again on failure page
  
app.post("/failure",function(req,res){
    res.redirect("/") //redirect to home page
})


//for running on localhost

// app.listen(3000,function(req,res){
//     console.log("server is running on port 3000");
// })



//To run on HEROKU We will change port
//|| 3000 to run on sysytem locally as well

app.listen(process.env.PORT ||3000,function(req,res){
    console.log("server is running on port 300");
})


// {"name":"abcd favourite hats","contacts":{"company":"mailchimp",""},"email_type_option":true}