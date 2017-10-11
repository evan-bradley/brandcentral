# Brand Central Station

[Live Website](http://brandcentral.xyz/)

## Build and Run

### Setup MySQL Database and Tables
In the 'server' directory:
```
npm run init-db
```

To remove the databases:
```
npm run uninit-db
```

### Install dependencies
In 'server':
```
npm install
```

In 'client':
```
npm install
```

### Create environment file
Create a text file named '.env' in the 'server' directory with contents:
```
DB_USER=root
DB_PASS=''
DB_NAME=BRAND_CENTRAL
SESSION_DB=SESSION_STORE
```

### Run Tests
In 'server':
```
npm test
```

### Serve with hot reload at localhost:8080
From 'server' directory (for API):
```
npm start
```

From 'client' directory (for web server):
```
npm run dev
```

### Serve production files at localhost:80
In 'client':
```
npm run build
```

In 'server':
```
sudo PORT=80 node src/server.js
```
