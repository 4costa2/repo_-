# Lean esto para que no hayan problemas con Git

> 💡 Para evitar problemas de merge y ramas sueltas, vamos a trabajar todos sobre la rama **`dev`**. Cuando este todo listo ahi hacemos merge al **`master`**. Pero bueno si quieren hacer su propia rama haganlo pero tengan cuidado.

<p align="center">
  <img src="https://media.giphy.com/media/9M5jK4GXmD5o1irGrF/giphy.gif" width="220" />
</p>


---

## 1. Configuración inicial (Solo la primera vez)
<p align="center">
  <img src="https://media1.tenor.com/m/67i3mnDO7hkAAAAC/hacking-guy-with-toy-laptor.gif" width="260" />
</p>


Por las dudas seria bueno borrar tu carpeta local y comenzar de cero con una de estas dos opciones:

### 🔹 Opción A: Con `git clone` (Recomendada y más simple)
1. Abrí la terminal en tu carpeta de proyectos.
2. Cloná el repositorio:
   ```bash
   git clone https://github.com/4costa2/repo_-.git
   ```
3. Entrá a la carpeta del proyecto:
   ```bash
   cd repo_-
   ```

### 🔹 Opción B: Con `git pull` sobre una carpeta existente
> ⚠️ **Importante:** Hacé el `pull` **ANTES** de crear o modificar archivos.

1. Abrí la terminal dentro de tu carpeta vacía.
2. Inicializá Git y vinculá el repositorio remoto:
   ```bash
   git init
   git remote add origin https://github.com/4costa2/repo_-.git
   ```
3. Descargá el repositorio completo:
   ```bash
   git pull origin master
   ```

---

## 2. Pasarse a la rama `dev`

Una vez que tengas el proyecto, pasate a la rama `dev`:

```bash
git switch dev
# o si no te la detecta de una:
git checkout -b dev origin/dev
```

---

## 3. Acuerdense de ser posible hagan todo en la rama `dev`

Cada vez que vayas a trabajar en tu parte:

### 1️⃣ Siempre antes de empezar a programar (o antes de subir):
Bajá lo que tus compañeros hayan subido para estar al día:
```bash
git pull origin dev
```

Si no hacés esto no vas a poder ver los cambios que los demas subieron.

 

### 2️⃣ Y cuando termines de hacer cambios, guardá tus cambios localmente:
```bash
git add .
git commit -m "Descripción"
```

### 3️⃣ Subí tus cambios a GitHub:
```bash
git push origin dev
```

---

## 4.  Si alguien necesita crear una rama propia (Opcional)

Si querés probar algo en una rama aparte sin tocar `dev`:

1. **Creá la rama a partir de `dev` actualizado:**
   ```bash
   git switch dev
   git pull origin dev
   git switch -c mi-funcionalidad
   ```
2. **Para subirla y luego integrarla a `dev`:**
   ```bash
   git push -u origin mi-funcionalidad
   ```
   Luego creás un Pull Request en GitHub hacia la rama `dev`.

---

## 5. Pasar los cambios a `master` (Solo al entregar / versión final)

Cuando todo en `dev` esté probado y funcionando:
```bash
git switch master
git pull origin master
git merge dev
git push origin master
```
