# HugoCornellier.com

Welcome to my personal portfolio website! You will find an about me section, a portfolio and a resume.

View it live at: [https://hugocornellier.com](https://hugocornellier.com)

## Set-up Instructions
### Dev:
- ```npm i && npm i --prefix ./frontend```
- ```npm start```
- In separate terminal:
  - ```npm start --prefix ./frontend```

### Production:
- At root: ```npm run build```
  - Low memory build: ```node --max_old_space_size=750 `which npm` run build```
- ```forever stopall && forever start ./backend/server.js```