# GMC_API

First go to your GMC panel and copy the URL when you manage it 

Then to start using it, we'll change values on .env file

So per exemple if your URL look like this https://cp-platinum-lon03.gmchosting.com/dashboard/game/servers/1/

Then goes to .env file and change like this

`ACCESS_KEY="test"` That will be the API key to trigger our API (SO CHANGE IT PLEASE)

`USERNAME=""`  GMC panel credentials

`PASSWORD=""`  GMC panel credentials

`SERVER_URL="https://cp-platinum-lon03.gmchosting.com"` Start of the URL above

`SERVER_ID="1"` ID following "servers" in the URL

And then just upload it to vercel, and change vercel.json to set the timing you want it start / stop your server !

------------

API Route Exemple

To start the server 
/start?secret=test

To stop the server
/stop?secret=test

To send command to server
/send?secret=test&command="Say test"
