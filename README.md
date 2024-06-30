# Web-Hosting 
### ```(Platform is still in developement features will be added soon)```
Platform is build to host static webisites 
### This platform provide you following features
* updating code from website
* update website every single time 
* change the subdoamin of website
* set visibilty of website ( public / private )
* Store website assets
## **How to start server**
### To start server we need to configure
* Node , MongoDb must installed in local mechine
* Run following command's to download required package's
```
  npm i express mongoose adm-zip multer bcrypt dotenv ejs cookie-parser jsonwebtoken
  ```
* Add ``` .env ``` file in project and add following code
```
PORT={port numner}
MONGOOSE_URL={mongoose url}
JWT_SECRET={your secret}
DOMAIN=http://localhost:{port number}
```
* Open cmd in same folder where app.js exists and run following commad
```
  npm start
```
* Your server will be start on ``` http://locahost:{port number} ```
* Paste this link in any browser and you will get access of website 
### How to host website
1. Compress website in single folder ( public ) 
2. uploade thie folder, you will get the website link to access site online 
3. ex. localhost:{ port number }/```demo-example```/webhost.web.app
### How to change doamin
1. Go to website setting's
2. Set Visibility of website
3. If visibilty is public then it is visible to everyone
4. If visibilty is private then it is only visible to authenticated user
***
# API For Developers 
### Login 
```
<form action="/login" method="post">
    <input type="text"  name="userName" required>
    <input type="password"  name="password" required>
    <button type="submit">Upload</button>
</form>
```
### Register 
```
<form action="/register" method="post">
    <input type="text"  name="userName" required>
    <input type="email"  name="email" required>
    <input type="radio"  name="visibility" value="true" checked>
    <input type="radio"  name="visibility" value="false">
    <input type="password"  name="password" required>
    <button type="submit">Upload</button>
</form>
```
### Logout
```
<form action="/logout">
    <button type="submit">Logout</button>
</form>
```
### change  domain , visibility ,default page name 
``` Note ```:  This platform sends cookies after login if your not using web browser then you shoud send this cookies with every request with name <i> secret. <i>
   <i> Add Website name dynamically  </i>
```
<form action="/:website/setting" method="post">
    <input type="text"  name="domain" required>
    <input type="text"  name="defaultPageName" required>
    <input type="text"  name="visibility" required>
    <button type="submit">Upload</button>
</form>
```
``` Note ```:  This platform sends cookies after login if your not using web browser then you shoud send this cookies with every request with name <i> secret <i>
### How to uplode website 
* User must be ``` Logged In ``` without authencation we can't change anything
```
<form action="/create/website" method="post" enctype="multipart/form-data">
    <input type="file" id="folder" name="folder" accept=".zip" required>
    <button type="submit">Upload</button>
</form>
```
### How to change domain
* User must be ``` Logged In ``` without authencation we can't change anything
```
<form action="/change/domain/" method="post">
    <input type="text" name="oldName" required>
    <input type="text" name="newName" required>
    <input type="submit">
</form>
```
### How to change visibilty 
* User must be ``` Logged In ``` without authencation we can't change anything
```
<form action="/change/visibility" method="post">
    <input type="text" name="websiteName" required>
    <select name="isVisible">
        <option value="true">Public</option>
        <option value="false">Private</option>
    </select>
    <input type="submit" value="Submit">
</form>
```
