const postmark = require("postmark")

var client = new postmark.ServerClient(process.env.POSTMARK_API_KEY)

client.sendEmail({
    "From": "yoniler333@roborena.com",
    "To": "yoniler333@roborena.com",
    "Subject": "Test 2",
    "TextBody": "Hello from Postmark Again!"
  }).then((result)=> {
    console.log("RESULT, " + result)
  }).catch(err=>{
    console.log("ERROR, " + err)
  })