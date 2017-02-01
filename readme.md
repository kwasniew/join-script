# join-script

Joins consecutive script tags into one script.
Use when you don't need AMD.



```
npm install join-script
join-script example/index.html > example/index.after.html
join-script --async=true --parent=body --output="js/main.js?v={hash}" example/index.html > example/index.after.html
join-script --defer=true example/index.html > example/index.after.html
```
