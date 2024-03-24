# HugoCornellier.com

Welcome to my personal portfolio website! You will find an about me section, a portfolio and a resume.

View it live at: [https://hugocornellier.com](https://hugocornellier.com)

## Set-up Instructions
### Dev:
- ```npm i && npm i --prefix ./frontend```
- ```npm start```
- In separate terminal:
  - ```npm start --prefix ./frontend```

### Production Build:
- Basic build: ```npm run build```
- Low memory builds:
  - 1GB system:```node --max_old_space_size=750 `which npm` run build```
  - 2GB system:```node --max_old_space_size=1500 `which npm` run build```
- Start server: ```forever stopall && forever start ./backend/server.js```