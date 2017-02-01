# join-script

Joins consecutive script tags into one script.
Use when you don't need AMD.


```
npm install join-script
```
Default settings (no defer/async, search inside body, js/main.js?v={hash})
```
join-script example/index.html > example/index.after.html
```

Make script async, only analyze scripts inside body and custom output script name
```
join-script --async=true --parent=body --output="js/main.js?v={hash}" example/index.html > example/index.after.html
```

Add defer to script
```
join-script --defer=true example/index.html > example/index.after.html
```


Ideas:
- fetch remote scripts (for now we ignore them)
