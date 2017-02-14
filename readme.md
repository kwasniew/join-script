# join-script

Joins consecutive script tags into one.
Useful for simple scenarios when you don't need AMD.

Turns
```
  <body>
    <script src="js/one.js"></script>
    <script src="js/two.js"></script>
    <script src="js/three.js"></script>
  </body>
```
into
```
  <body>
    <script src="js/main.js?v=c9a7c7ed62"></script>
  </body>
```
Hash is MD5 of the joined content.

## Usage
```
npm install join-script
```
Default settings (no defer/async, finds scripts inside head and body, generates js/main.js?v={hash}) at the end of the body
```
join-script example/index.html > example/index.after.html
```

Make script async, only analyze scripts inside head and create custom output script with explicit name and
injected to the end of the body
```
join-script --async=true --from=head --to=body --output="js/main.js?v={hash}" example/index.html > example/index.after.html
```

Add defer to script
```
join-script --defer=true example/index.html > example/index.after.html
```


Ideas:
- fetch remote scripts (for now we ignore them)
