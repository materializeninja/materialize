 To initialize the script Materialize Form

1. Include materialize.css file
3. Include ninja.js helper file
4. Include materialize.js file
5. New Materialize().Form()
6. Provide ID of form when newing
7. Make sure all elements you want Materialized have `tabindex` attribute on them. Without this they will be skipped over and not included in your new Materialize Form

```html
<link href="/Materialize/materialize.css" rel="stylesheet">

<script src="/Materialize/ninja.js"></script>
<script src="/Materialize/materialize.js"></script>

<script>
    const NinjaForm = new Materialize()
        .Form({
            form: 'NinjaForm',
        });
</script>

<div id="NinjaForm">
    <div class="material text">
        <label for="default-text-field"><span>Default Text Field</span></label>
        <input type="text" id="default-text-field" name="default-text-field" value="" tabindex="1">
    </div>
</div>
```

[Materialize.Ninja Wiki](https://github.com/bannostookaylo/materialize.ninja/wiki)
