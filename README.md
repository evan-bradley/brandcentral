# Brand Central Station

[Live Website](http://brandcentral.xyz/)

## Build and Run

### Setup MySQL Database and Tables
From root directory:
```
mysql -uroot
source setup.sql;
exit;
```

### Install dependencies
In root directory:
```
npm install
```

In 'client':
```
npm install
```

### Create environment file:
Create a text file named '.env' in the 'server' directory with contents:
```
DB_USER=root
DB_PASS=''
DB_NAME=BRAND_CENTRAL
SESSION_DB=SESSION_STORE
```
### Serve with hot reload at localhost:8080
From 'server' directory (for API):
```
node server.js
```

From 'client' directory (for web server):
```
npm run dev
```
